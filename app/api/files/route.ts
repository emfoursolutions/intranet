// ABOUTME: API route for fetching and uploading files
// ABOUTME: GET returns all files with categories, POST handles file upload (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const files = await prisma.file.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;

    if (!file || !name || !categoryId) {
      return NextResponse.json(
        { error: 'File, name, and category are required' },
        { status: 400 }
      );
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '52428800');
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const fileRecord = await prisma.file.create({
      data: {
        name,
        description,
        filePath: `/uploads/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
