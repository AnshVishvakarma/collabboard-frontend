/**
 * Refresh Token API Route
 * Issues new access and refresh tokens
 * @route POST /api/auth/refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const refreshTokenSchema = yup.object().shape({
  refreshToken: yup
    .string()
    .required('Refresh token is required')
    .min(10, 'Invalid refresh token'),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token: string) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      name: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Generate new tokens
 */
const generateTokens = (user: { id: string; email: string; name: string }) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    refreshSecret,
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
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
      await refreshTokenSchema.validate(body, { 
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

    const { refreshToken } = body;

    // ============================================
    // VERIFY REFRESH TOKEN
    // ============================================
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired refresh token',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ============================================
    // CHECK SESSION
    // ============================================
    const session = await prisma.userSession.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (new Date() > session.expiresAt) {
      await prisma.userSession.delete({
        where: { id: session.id },
      });
      
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token expired. Please login again.',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    if (!session.user) {
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
    // GENERATE NEW TOKENS
    // ============================================
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({
      id: session.user.id.toString(),
      email: session.user.email,
      name: session.user.name || '',
    });

    // ============================================
    // UPDATE SESSION
    // ============================================
    await prisma.$transaction(async (tx) => {
      await tx.userSession.delete({
        where: { id: session.id },
      });

      await tx.userSession.create({
        data: {
          userId: session.user.id,
          token: newAccessToken,
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ipAddress: request.ip || null,
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
        message: 'Tokens refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: '7d',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Refresh token error:', error);
    
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