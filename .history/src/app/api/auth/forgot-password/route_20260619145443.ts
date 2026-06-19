/**
 * Forgot Password API Route
 * Sends password reset email
 * @route POST /api/auth/forgot-password
 */

import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),
});

const resetPasswordSchema = yup.object().shape({
  token: yup
    .string()
    .required('Reset token is required'),
  
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

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// ============================================
// API ROUTE HANDLER - REQUEST RESET
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    try {
      await forgotPasswordSchema.validate(body, { abortEarly: false });
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

    const { email } = body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json(
        {
          success: true,
          message: 'If your email is registered, you will receive a password reset link.',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Generate reset token (expires in 1 hour)
    const resetSecret = process.env.JWT_SECRET || 'fallback-secret';
    const resetToken = jwt.sign(
      { userId: user.id.toString(), email: user.email },
      resetSecret,
      { expiresIn: '1h' }
    );

    // In production, send email with reset link
    // For now, just return the token (for testing)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json(
      {
        success: true,
        message: 'If your email is registered, you will receive a password reset link.',
        // Include token for testing (remove in production)
        testToken: resetToken,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
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

// ============================================
// API ROUTE HANDLER - RESET PASSWORD
// ============================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate reset data
    try {
      await resetPasswordSchema.validate(body, { abortEarly: false });
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

    const { token, newPassword } = body;

    // Verify token
    const resetSecret = process.env.JWT_SECRET || 'fallback-secret';
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, resetSecret);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired reset token',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: BigInt(decoded.userId) },
        data: { password: hashedPassword },
      });

      // Delete all sessions (force logout)
      await tx.userSession.deleteMany({
        where: { userId: BigInt(decoded.userId) },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully. Please login with your new password.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Reset password error:', error);
    
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