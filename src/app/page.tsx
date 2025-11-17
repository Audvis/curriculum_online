'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/three/AnimatedBackground';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Award,
  ExternalLink,
  Menu,
  X,
  Download
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Presente';
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const groupedSkills = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) : {};

  const featuredProjects = Array.isArray(projects) ? projects.filter(p => p.featured) : [];
  const otherProjects = Array.isArray(projects) ? projects.filter(p => !p.featured) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!personalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Portfolio en Construcción</h1>
          <p className="text-gray-300">Por favor, configura tu información desde el panel de administración</p>
          <a 
            href="/admin" 
            className="inline-block mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Ir a Administración
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {personalInfo.fullName}
            </motion.h1>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['about', 'experience', 'education', 'projects', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-purple-400 transition-colors ${
                    activeSection === section ? 'text-purple-400' : 'text-gray-300'
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
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {['about', 'experience', 'education', 'projects', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left py-2 px-4 rounded hover:bg-white/10 capitalize ${
                    activeSection === section ? 'text-purple-400 bg-white/5' : 'text-gray-300'
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

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex items-center justify-center relative z-10 pt-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {personalInfo.avatar && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-8"
              >
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-purple-500 shadow-2xl"
                />
              </motion.div>
            )}
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              {personalInfo.fullName}
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl text-purple-300 mb-8"
            >
              {personalInfo.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all hover:scale-105">
                  <Mail size={20} />
                  <span>Contactar</span>
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-105">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-105">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      {Array.isArray(experiences) && experiences.length > 0 && (
        <section id="experience" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Experiencia Profesional
            </motion.h2>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {Array.isArray(experiences) && experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.position}</h3>
                      <p className="text-xl text-purple-300">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 mt-2 md:mt-0">
                      <Calendar size={16} />
                      <span>{formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}</span>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
                  )}
                  
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {Array.isArray(education) && education.length > 0 && (
        <section id="education" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Educación
            </motion.h2>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {Array.isArray(education) && education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                      <p className="text-xl text-purple-300">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-gray-300">{edu.field}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 mt-2 md:mt-0">
                      <Calendar size={16} />
                      <span>{formatDate(edu.startDate)} - {edu.current ? 'Presente' : formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                  
                  {edu.description && (
                    <p className="text-gray-300 leading-relaxed">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {Array.isArray(projects) && projects.length > 0 && (
        <section id="projects" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Proyectos Destacados
            </motion.h2>
            
            {/* Featured Projects */}
            {Array.isArray(projects) && featuredProjects.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-purple-300 mb-8 text-center">Destacados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all group"
                    >
                      {project.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                        )}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.split(',').slice(0, 3).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-600/30">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm"
                            >
                              <ExternalLink size={16} />
                              <span>Ver</span>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm"
                            >
                              <Github size={16} />
                              <span>Código</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects */}
            {Array.isArray(projects) && otherProjects.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-purple-300 mb-8 text-center">Otros Proyectos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm"
                          >
                            <ExternalLink size={14} />
                            <span>Ver</span>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm"
                          >
                            <Github size={14} />
                            <span>Código</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {Array.isArray(skills) && skills.length > 0 && (
        <section id="skills" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Habilidades
            </motion.h2>
            
            <div className="max-w-6xl mx-auto space-y-12">
              {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <h3 className="text-2xl font-semibold text-purple-300 mb-6 text-center">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.isArray(categorySkills) && categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all text-center"
                      >
                        <div className="text-white font-medium mb-2">{skill.name}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full mx-0.5 ${
                                i < skill.level ? 'bg-purple-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          {skill.level === 1 ? 'Principiante' :
                           skill.level === 2 ? 'Básico' :
                           skill.level === 3 ? 'Intermedio' :
                           skill.level === 4 ? 'Avanzado' : 'Experto'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Contacto
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors">
                  <Mail className="text-purple-400" size={20} />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors">
                  <Phone className="text-purple-400" size={20} />
                  <span>{personalInfo.phone}</span>
                </a>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-purple-400" size={20} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors">
                  <Globe className="text-purple-400" size={20} />
                  <span>Website</span>
                </a>
              )}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20 flex justify-center gap-6">
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Github size={24} />
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin size={24} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 {personalInfo.fullName}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}