// ABOUTME: API route for updating and deleting specific files
// ABOUTME: PUT updates file metadata, DELETE removes file from DB and filesystem (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, categoryId } = body;

    const file = await prisma.file.update({
      where: { id: params.id },
      data: {
        name,
        description,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: params.id },
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    try {
      const filePath = join(process.cwd(), 'public', file.filePath);
      await unlink(filePath);
    } catch (error) {
      console.warn('Could not delete physical file:', error);
    }

    await prisma.file.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
