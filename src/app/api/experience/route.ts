import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { startDate: 'desc' }
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Experience API error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const experience = await db.experience.create({
      data: {
        company: payload.company,
        position: payload.position,
        description: payload.description?.trim() ? payload.description : null,
        startDate: new Date(payload.startDate),
        endDate:
          payload.current || !payload.endDate ? null : new Date(payload.endDate),
        current: !!payload.current,
        technologies: payload.technologies?.trim() ? payload.technologies : null,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    const { id } = payload;
    
    const experience = await db.experience.update({
      where: { id },
      data: {
        company: payload.company,
        position: payload.position,
        description: payload.description?.trim() ? payload.description : null,
        startDate: new Date(payload.startDate),
        endDate:
          payload.current || !payload.endDate ? null : new Date(payload.endDate),
        current: !!payload.current,
        technologies: payload.technologies?.trim() ? payload.technologies : null,
      },
    });
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.experience.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}