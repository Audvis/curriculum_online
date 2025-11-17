'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/three/AnimatedBackground';
import { Menu, X } from 'lucide-react';
import { AboutSection } from '@/components/home/AboutSection';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { EducationSection } from '@/components/home/EducationSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/home/Footer';

interface PersonalInfo {
  id?: string;
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  avatar: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  technologies: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}



export default function Home() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [personalRes, expRes, eduRes, projRes, skillsRes] = await Promise.all([
        fetch('/api/personal-info'),
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/projects'),
        fetch('/api/skills')
      ]);

      const [personalData, expData, eduData, projData, skillsData] = await Promise.all([
        personalRes.json(),
        expRes.json(),
        eduRes.json(),
        projRes.json(),
        skillsRes.json()
      ]);

      setPersonalInfo(personalData);
      setExperiences(Array.isArray(expData) ? expData : []);
      setEducation(Array.isArray(eduData) ? eduData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent reduce errors
      setExperiences([]);
      setEducation([]);
      setProjects([]);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!personalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Portfolio en Construcción</h1>
          <p className="text-gray-300">Por favor, configura tu información desde el panel de administración</p>
          <a 
            href="/admin" 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Ir a Administración
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-none"
            >
              {personalInfo.fullName}
            </motion.h1>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-6 xl:space-x-8">
              {['about', 'experience', 'education', 'projects', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-blue-400 transition-colors text-sm xl:text-base ${
                    activeSection === section ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {section === 'about' ? 'Sobre Mí' :
                   section === 'experience' ? 'Experiencia' :
                   section === 'education' ? 'Educación' :
                   section === 'projects' ? 'Proyectos' :
                   section === 'skills' ? 'Habilidades' : 'Contacto'}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mt-3 space-y-1 pb-2 max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              {['about', 'experience', 'education', 'projects', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 capitalize transition-colors ${
                    activeSection === section ? 'text-blue-400 bg-white/5' : 'text-gray-300'
                  }`}
                >
                  {section === 'about' ? 'Sobre Mí' :
                   section === 'experience' ? 'Experiencia' :
                   section === 'education' ? 'Educación' :
                   section === 'projects' ? 'Proyectos' :
                   section === 'skills' ? 'Habilidades' : 'Contacto'}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      <AboutSection personalInfo={personalInfo} />

      <ExperienceSection experiences={experiences} />

      <EducationSection education={education} />

      <ProjectsSection projects={projects} />

      <SkillsSection skills={skills} />

      <ContactSection personalInfo={personalInfo} />

      <Footer fullName={personalInfo.fullName} />
    </div>
  );
}