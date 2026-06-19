/**
 * Change Password API Route
 * Changes authenticated user's password
 * @route POST /api/auth/change-password
 */

import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// ============================================
// API ROUTE HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // EXTRACT AND VERIFY TOKEN
    // ============================================
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'No token provided',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ============================================
    // VALIDATE INPUT
    // ============================================
    const body = await request.json();

    try {
      await changePasswordSchema.validate(body, { 
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (validationError: any) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationError.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = body;

    // ============================================
    // GET USER WITH PASSWORD
    // ============================================
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // ============================================
    // VERIFY CURRENT PASSWORD
    // ============================================
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Current password is incorrect',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ============================================
    // UPDATE PASSWORD
    // ============================================
    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      // Update password
      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Delete all sessions (force logout from all devices)
      await tx.userSession.deleteMany({
        where: { userId: user.id },
      });
    });

    // ============================================
    // RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: 'Password changed successfully. Please login again.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Change password error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}