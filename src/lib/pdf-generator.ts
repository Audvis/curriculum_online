import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface PersonalInfo {
  fullName: string;
  title: string;
  bio?: string | null;
  email: string;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
}

interface Experience {
  company: string;
  position: string;
  description?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  technologies?: string | null;
}

interface Education {
  institution: string;
  degree: string;
  field?: string | null;
  description?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
}

interface Project {
  title: string;
  description?: string | null;
  technologies?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
}

interface Skill {
  name: string;
  category: string;
  level: number;
}

interface ResumeData {
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
}

export function generateResumePDF(data: ResumeData): ArrayBuffer {
  const doc = new jsPDF();
  let yPosition = 20;

  // Colors
  const primaryColor = [41, 128, 185] as [number, number, number]; // Professional blue
  const textColor = [44, 62, 80] as [number, number, number]; // Dark gray

  // Helper function to add section title
  const addSectionTitle = (title: string) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFillColor(...primaryColor);
    doc.rect(14, yPosition - 5, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 16, yPosition + 2);
    doc.setTextColor(...textColor);
    yPosition += 15;
  };

  // Helper function to format date
  const formatDate = (date: Date | string | null | undefined, current: boolean = false) => {
    if (current) return 'Present';
    if (!date) return '';
    const d = new Date(date);
    return format(d, 'MMM yyyy');
  };

  // Header - Personal Info
  if (data.personalInfo) {
    const info = data.personalInfo;

    // Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(info.fullName, 105, yPosition, { align: 'center' });
    yPosition += 10;

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(info.title, 105, yPosition, { align: 'center' });
    yPosition += 10;

    // Contact info
    doc.setFontSize(10);
    const contactParts: string[] = [];
    if (info.email) contactParts.push(info.email);
    if (info.phone) contactParts.push(info.phone);
    if (info.location) contactParts.push(info.location);

    if (contactParts.length > 0) {
      doc.text(contactParts.join(' | '), 105, yPosition, { align: 'center' });
      yPosition += 6;
    }

    // Links
    const linkParts: string[] = [];
    if (info.website) linkParts.push(info.website);
    if (info.linkedin) linkParts.push(info.linkedin);
    if (info.github) linkParts.push(info.github);

    if (linkParts.length > 0) {
      doc.setTextColor(...primaryColor);
      doc.text(linkParts.join(' | '), 105, yPosition, { align: 'center' });
      yPosition += 8;
    }

    // Bio/Summary
    if (info.bio) {
      doc.setTextColor(...textColor);
      yPosition += 5;
      addSectionTitle('PROFESSIONAL SUMMARY');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const bioLines = doc.splitTextToSize(info.bio, 176);
      doc.text(bioLines, 14, yPosition);
      yPosition += bioLines.length * 5 + 10;
    }
  }

  // Experience Section
  if (data.experiences.length > 0) {
    addSectionTitle('WORK EXPERIENCE');

    data.experiences.forEach((exp) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Position and Company
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, 14, yPosition);

      // Date range
      const dateRange = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate, exp.current)}`;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(dateRange, 196, yPosition, { align: 'right' });
      yPosition += 6;

      // Company
      doc.setFont('helvetica', 'italic');
      doc.text(exp.company, 14, yPosition);
      yPosition += 6;

      // Description
      if (exp.description) {
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(exp.description, 176);
        doc.text(descLines, 14, yPosition);
        yPosition += descLines.length * 5 + 2;
      }

      // Technologies
      if (exp.technologies) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Technologies: ', 14, yPosition);
        const techWidth = doc.getTextWidth('Technologies: ');
        doc.setFont('helvetica', 'normal');
        const techLines = doc.splitTextToSize(exp.technologies, 176 - techWidth);
        doc.text(techLines, 14 + techWidth, yPosition);
        yPosition += techLines.length * 4 + 2;
      }

      yPosition += 8;
    });
  }

  // Education Section
  if (data.education.length > 0) {
    addSectionTitle('EDUCATION');

    data.education.forEach((edu) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Degree
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
      doc.text(degreeText, 14, yPosition);

      // Date range
      const dateRange = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate, edu.current)}`;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(dateRange, 196, yPosition, { align: 'right' });
      yPosition += 6;

      // Institution
      doc.setFont('helvetica', 'italic');
      doc.text(edu.institution, 14, yPosition);
      yPosition += 6;

      // Description
      if (edu.description) {
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(edu.description, 176);
        doc.text(descLines, 14, yPosition);
        yPosition += descLines.length * 5 + 2;
      }

      yPosition += 8;
    });
  }

  // Skills Section
  if (data.skills.length > 0) {
    addSectionTitle('SKILLS');

    // Group skills by category
    const skillsByCategory: Record<string, Skill[]> = {};
    data.skills.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, 14, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillNames = skills.map(s => s.name).join(', ');
      const skillLines = doc.splitTextToSize(skillNames, 176);
      doc.text(skillLines, 14, yPosition);
      yPosition += skillLines.length * 5 + 6;
    });
  }

  // Projects Section
  if (data.projects.length > 0) {
    addSectionTitle('PROJECTS');

    const projectData = data.projects.map((project) => [
      project.title,
      project.description || '',
      project.technologies || '',
      [project.liveUrl, project.githubUrl].filter(Boolean).join('\n') || ''
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Project', 'Description', 'Technologies', 'Links']],
      body: projectData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 70 },
        2: { cellWidth: 45 },
        3: { cellWidth: 35, fontSize: 8 }
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: 14, right: 14 }
    });
  }

  // Footer with generation date
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${format(new Date(), 'MMMM dd, yyyy')} | Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  return doc.output('arraybuffer');
}
