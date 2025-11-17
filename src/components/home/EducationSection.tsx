'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

type Education = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
};

function formatDate(dateString?: string) {
  if (!dateString) return 'Presente';
  return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
}

export function EducationSection({ education }: { education: Education[] }) {
  if (!Array.isArray(education) || education.length === 0) return null;
  return (
    <section id="education" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        >
          Educación
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
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
                  <p className="text-xl text-blue-300">{edu.institution}</p>
                  {edu.field && <p className="text-gray-300">{edu.field}</p>}
                </div>
                <div className="flex items-center gap-2 text-gray-300 mt-2 md:mt-0">
                  <Calendar size={16} />
                  <span>
                    {formatDate(edu.startDate)} - {edu.current ? 'Presente' : formatDate(edu.endDate)}
                  </span>
                </div>
              </div>

              {edu.description && <p className="text-gray-300 leading-relaxed">{edu.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}