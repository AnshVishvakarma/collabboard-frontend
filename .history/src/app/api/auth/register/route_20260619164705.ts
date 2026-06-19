
import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// ============================================
// VALIDATION SCHEMA
// ============================================
const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * Generate JWT tokens
 */
const generateTokens = (user: { id: bigint; email: string; name: string }) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  
  const accessToken = jwt.sign(
    { userId: user.id.toString(), email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id.toString(), email: user.email, name: user.name },
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
      await registerSchema.validate(body, { 
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

    const { name, email, password, acceptTerms } = body;

    // ============================================
    // CHECK IF USER EXISTS
    // ============================================
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // ============================================
    // CREATE USER
    // ============================================
    const hashedPassword = await hashPassword(password);

    const user = await prisma.$transaction(async (tx: any) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          status: 'OFFLINE',
        },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          status: true,
          createdAt: true,
        },
      });

      return newUser;
    });

    // ============================================
    // GENERATE TOKENS
    // ============================================
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // ============================================
    // RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            status: user.status,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already exists',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Handle other errors
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