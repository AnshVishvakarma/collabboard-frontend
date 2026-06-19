/**
 * Login API Route
 * Authenticates user and returns JWT tokens
 * @route POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim()
    .transform((value) => value?.toLowerCase().trim()),
  
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password cannot be empty'),
  
  rememberMe: yup
    .boolean()
    .optional()
    .default(false),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate JWT tokens
 */
const generateTokens = (user: { id: bigint; email: string; name: string }, rememberMe: boolean = false) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  const accessExpiry = rememberMe ? '30d' : '7d';
  
  const accessToken = jwt.sign(
    { userId: user.id.toString(), email: user.email, name: user.name },
    secret,
    { expiresIn: accessExpiry }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id.toString(), email: user.email, name: user.name },
    refreshSecret,
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken, expiresIn: accessExpiry };
};

// ============================================
// API ROUTE HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // ============================================
    // VALIDATION
    // ============================================
    try {
      await loginSchema.validate(body, { 
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

    const { email, password, rememberMe } = body;

    // ============================================
    // FIND USER
    // ============================================
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        profileImage: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        _count: {
          select: { sessions: true }
        }
      },
    });

    // User not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ============================================
    // VERIFY PASSWORD
    // ============================================
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ============================================
    // UPDATE USER STATUS
    // ============================================
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        status: 'ONLINE',
        lastSeen: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        status: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    // ============================================
    // GENERATE TOKENS
    // ============================================
    const { accessToken, refreshToken, expiresIn } = generateTokens(user, rememberMe);

    // ============================================
    // STORE SESSION
    // ============================================
    await prisma.$transaction(async (tx: any) => {
      // Limit active sessions to 5
      const sessionCount = await tx.userSession.count({
        where: { userId: user.id }
      });

      if (sessionCount >= 5) {
        // Delete oldest session
        const oldestSession = await tx.userSession.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' },
          select: { id: true }
        });
        
        if (oldestSession) {
          await tx.userSession.delete({
            where: { id: oldestSession.id }
          });
        }
      }
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')

      // Create new session
      await tx.userSession.create({
        data: {
          userId: user.id,
          token: accessToken,
          refreshToken: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ipAddress: ipAddress || null,
          userAgent: request.headers.get('user-agent') || null,
        },
      });
    });

    // ============================================
    // RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: updatedUser.id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            status: updatedUser.status,
            lastSeen: updatedUser.lastSeen,
            createdAt: updatedUser.createdAt,
          },
          accessToken,
          refreshToken,
          expiresIn,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login error:', error);
    
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