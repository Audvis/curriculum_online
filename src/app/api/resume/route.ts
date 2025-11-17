import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResumePDF } from '@/lib/pdf-generator';

export async function GET() {
  try {
    // Fetch all data in parallel
    const [personalInfo, experiences, education, projects, skills] = await Promise.all([
      db.personalInfo.findFirst(),
      db.experience.findMany({
        orderBy: { startDate: 'desc' }
      }),
      db.education.findMany({
        orderBy: { startDate: 'desc' }
      }),
      db.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' }
      }),
      db.skill.findMany({
        orderBy: [
          { category: 'asc' },
          { level: 'desc' }
        ]
      })
    ]);

    // Generate PDF
    const pdfBuffer = generateResumePDF({
      personalInfo,
      experiences,
      education,
      projects,
      skills
    });

    // Create filename
    const fileName = personalInfo?.fullName
      ? `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error generating resume PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume PDF' },
      { status: 500 }
    );
  }
}
