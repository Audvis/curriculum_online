import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const personalInfo = await db.personalInfo.findFirst();
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Personal info API error:', error);
    return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Delete existing personal info if exists
    await db.personalInfo.deleteMany();
    
    const personalInfo = await db.personalInfo.create({
      data
    });
    
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Create personal info error:', error);
    return NextResponse.json({ error: 'Failed to create personal info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...dataWithoutId } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    const personalInfo = await db.personalInfo.update({
      where: { id },
      data: dataWithoutId
    });

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Update personal info error:', error);
    return NextResponse.json({ error: 'Failed to update personal info' }, { status: 500 });
  }
}