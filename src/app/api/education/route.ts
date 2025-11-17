import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const education = await db.education.findMany({
      orderBy: { startDate: 'desc' }
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error('Education API error:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const education = await db.education.create({
      data: {
        institution: payload.institution,
        degree: payload.degree,
        field: payload.field?.trim() ? payload.field : null,
        description: payload.description?.trim() ? payload.description : null,
        startDate: new Date(payload.startDate),
        endDate:
          payload.current || !payload.endDate ? null : new Date(payload.endDate),
        current: !!payload.current,
      },
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error('Create education error:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    const { id } = payload;
    
    const education = await db.education.update({
      where: { id },
      data: {
        institution: payload.institution,
        degree: payload.degree,
        field: payload.field?.trim() ? payload.field : null,
        description: payload.description?.trim() ? payload.description : null,
        startDate: new Date(payload.startDate),
        endDate:
          payload.current || !payload.endDate ? null : new Date(payload.endDate),
        current: !!payload.current,
      },
    });
    
    return NextResponse.json(education);
  } catch (error) {
    console.error('Update education error:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.education.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}