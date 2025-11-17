'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

type Experience = {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  technologies?: string;
};

function formatDate(dateString?: string) {
  if (!dateString) return 'Presente';
  return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
}

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (!Array.isArray(experiences) || experiences.length === 0) return null;
  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        >
          Experiencia Profesional
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{exp.position}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-blue-300">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-300 mt-2 md:mt-0 text-sm sm:text-base">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span>
                    {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}
                  </span>
                </div>
              </div>

              {exp.description && <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{exp.description}</p>}

              {exp.technologies && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {exp.technologies.split(',').map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs sm:text-sm border border-blue-600/30"
                    >
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
  );
}