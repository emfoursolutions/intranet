// ABOUTME: API route for fetching and creating wiki articles
// ABOUTME: GET returns all articles, POST creates new article (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.wikiArticle.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { title: 'asc' },
      ],
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching wiki articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wiki articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, icon, color, category, sortOrder } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const article = await prisma.wikiArticle.create({
      data: {
        title,
        description,
        content,
        icon,
        color: color ?? '#0ea5e9',
        category,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating wiki article:', error);
    return NextResponse.json(
      { error: 'Failed to create wiki article' },
      { status: 500 }
    );
  }
}
