/**
 * Get Current User API Route
 * Returns authenticated user's profile data
 * @route GET /api/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify JWT token
 */
const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
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

// ============================================
// API ROUTE HANDLER
// ============================================

export async function GET(request: NextRequest) {
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
    // FETCH USER
    // ============================================
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        workspaces: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
          },
          take: 5,
        },
        workspaceMembers: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            role: true,
          },
          take: 5,
        },
        _count: {
          select: {
            workspaces: true,
            workspaceMembers: true,
            sentMessages: true,
            createdBoards: true,
            createdTasks: true,
          },
        },
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
    // UPDATE LAST SEEN (background)
    // ============================================
    prisma.user.update({
      where: { id: BigInt(decoded.userId) },
      data: { lastSeen: new Date() },
    }).catch(error => console.error('Failed to update last seen:', error));

    // ============================================
    // RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        data: {
          ...user,
          id: user.id.toString(),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get user error:', error);
    
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