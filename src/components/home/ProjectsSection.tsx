'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description?: string;
  technologies?: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
};

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!Array.isArray(projects) || projects.length === 0) return null;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        >
          Proyectos Destacados
        </motion.h2>

        {featuredProjects.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-6 sm:mb-8 text-center">Destacados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all group"
                >
                  {project.imageUrl && (
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-300 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">{project.description}</p>
                    )}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {project.technologies
                          .split(',')
                          .slice(0, 3)
                          .map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 sm:py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs border border-blue-600/30"
                            >
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
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                        >
                          <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                          <span>Ver</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                        >
                          <Github size={14} className="sm:w-4 sm:h-4" />
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

        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-6 sm:mb-8 text-center">Otros Proyectos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                      >
                        <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>Ver</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                      >
                        <Github size={12} className="sm:w-3.5 sm:h-3.5" />
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
  );
}