'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonalInfoForm } from '@/components/admin/PersonalInfoForm';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { EducationForm } from '@/components/admin/EducationForm';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { SkillsForm } from '@/components/admin/SkillsForm';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award,
  Settings,
  Eye,
  Save
} from 'lucide-react';

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

export default function AdminPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetchError(null);
      const [personalRes, expRes, eduRes, projRes, skillsRes] = await Promise.all([
        fetch('/api/personal-info'),
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/projects'),
        fetch('/api/skills')
      ]);

      // Validate all responses before parsing
      if (!personalRes.ok) {
        console.error('Failed to fetch personal info:', personalRes.status);
      }
      if (!expRes.ok) {
        console.error('Failed to fetch experiences:', expRes.status);
      }
      if (!eduRes.ok) {
        console.error('Failed to fetch education:', eduRes.status);
      }
      if (!projRes.ok) {
        console.error('Failed to fetch projects:', projRes.status);
      }
      if (!skillsRes.ok) {
        console.error('Failed to fetch skills:', skillsRes.status);
      }

      const [personalData, expData, eduData, projData, skillsData] = await Promise.all([
        personalRes.ok ? personalRes.json() : null,
        expRes.ok ? expRes.json() : [],
        eduRes.ok ? eduRes.json() : [],
        projRes.ok ? projRes.json() : [],
        skillsRes.ok ? skillsRes.json() : []
      ]);

      setPersonalInfo(personalData);
      setExperiences(Array.isArray(expData) ? expData : []);
      setEducation(Array.isArray(eduData) ? eduData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchError('Error al cargar los datos. Intente recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPortfolio = () => {
    window.open('/', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {fetchError && (
        <div className="mb-6 p-4 rounded-md bg-red-500/20 border border-red-500/50 text-red-200">
          {fetchError}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-300">Gestiona tu portfolio profesional</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleViewPortfolio}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Portfolio
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
          <TabsTrigger value="personal" className="text-white data-[state=active]:bg-white/20">
            <User className="w-4 h-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="experience" className="text-white data-[state=active]:bg-white/20">
            <Briefcase className="w-4 h-4 mr-2" />
            Experiencia
          </TabsTrigger>
          <TabsTrigger value="education" className="text-white data-[state=active]:bg-white/20">
            <GraduationCap className="w-4 h-4 mr-2" />
            Educación
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-white data-[state=active]:bg-white/20">
            <Code className="w-4 h-4 mr-2" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-white data-[state=active]:bg-white/20">
            <Award className="w-4 h-4 mr-2" />
            Habilidades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Información Personal</CardTitle>
              <CardDescription className="text-gray-300">
                Tu información básica y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm 
                data={personalInfo} 
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Experiencia Laboral</CardTitle>
              <CardDescription className="text-gray-300">
                Tu trayectoria profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExperienceForm 
                experiences={experiences} 
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Educación</CardTitle>
              <CardDescription className="text-gray-300">
                Tu formación académica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationForm 
                education={education} 
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Proyectos</CardTitle>
              <CardDescription className="text-gray-300">
                Tu trabajo destacado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectForm 
                projects={projects} 
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Habilidades</CardTitle>
              <CardDescription className="text-gray-300">
                Tus competencias técnicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsForm 
                skills={skills} 
                onUpdate={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}