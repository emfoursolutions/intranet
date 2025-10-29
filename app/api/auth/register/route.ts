// ABOUTME: API route for creating initial admin user
// ABOUTME: Only allows registration if no users exist (setup mode)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Registration is disabled. Admin user already exists.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}
