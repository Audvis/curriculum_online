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
          {experiences.map((exp, index) => (
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
                  <span>
                    {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}
                  </span>
                </div>
              </div>

              {exp.description && <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>}

              {exp.technologies && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.split(',').map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30"
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