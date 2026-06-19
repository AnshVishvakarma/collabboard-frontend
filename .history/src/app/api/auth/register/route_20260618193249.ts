import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/auth.validator';
import { hashPassword } from '@/lib/password';
import { generateTokens } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    try {
      await registerSchema.validate(body, { abortEarly: false });
    } catch (validationError: any) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationError.errors 
        },
        { status: 400 }
      );
    }

    const { name, email, password, lead_id, group_id } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
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

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    // Store refresh token in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          accessToken,
          refreshToken,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}