// ABOUTME: API route for updating and deleting specific wiki articles
// ABOUTME: PUT updates article, DELETE removes article (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.wikiArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wiki article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, content, icon, color, category, sortOrder } = body;

    const article = await prisma.wikiArticle.update({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        icon,
        color,
        category,
        sortOrder,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to update wiki article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.wikiArticle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to delete wiki article' },
      { status: 500 }
    );
  }
}
