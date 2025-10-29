// ABOUTME: API route for fetching and creating applications
// ABOUTME: GET returns all applications, POST creates new application (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, url, ssoEnabled, icon, category, color, sortOrder } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        name,
        description,
        url,
        ssoEnabled: ssoEnabled ?? false,
        icon,
        category,
        color: color ?? '#0ea5e9',
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
