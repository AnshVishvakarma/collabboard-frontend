

import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const logoutSchema = yup.object().shape({
  refreshToken: yup
    .string()
    .required('Refresh token is required'),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify refresh token to identify user
 */
const verifyRefreshToken = (token: string) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
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
      await logoutSchema.validate(body, { 
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
    // FIND AND DELETE SESSION
    // ============================================
    const session = await prisma.userSession.findUnique({
      where: { refreshToken },
      select: {
        id: true,
        userId: true,
      },
    });

    if (session) {
      // Check if user has other active sessions
      const activeSessions = await prisma.userSession.count({
        where: { 
          userId: session.userId,
          id: { not: session.id },
        },
      });

      // If no other sessions, set user offline
      if (activeSessions === 0) {
        await prisma.user.update({
          where: { id: session.userId },
          data: { 
            status: 'OFFLINE',
            lastSeen: new Date(),
          },
        });
      }

      // Delete the session
      await prisma.userSession.delete({
        where: { id: session.id },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Logged out successfully',
          data: {
            sessionId: session.id,
            remainingSessions: activeSessions,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // If session not found, still return success
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Logout error:', error);
    
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