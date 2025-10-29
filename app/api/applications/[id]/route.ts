// ABOUTME: API route for updating and deleting specific applications
// ABOUTME: PUT updates application, DELETE removes application (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, url, ssoEnabled, icon, category, color, sortOrder } = body;

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        name,
        description,
        url,
        ssoEnabled,
        icon,
        category,
        color,
        sortOrder,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
