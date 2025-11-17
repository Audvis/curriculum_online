'use client';

import { motion } from 'framer-motion';

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!Array.isArray(skills) || skills.length === 0) return null;
  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="min-h-screen py-20 relative z-10 flex items-center">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
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
                {categorySkills.map((skill, skillIndex) => (
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
                          className={`w-2 h-2 rounded-full mx-0.5 ${i < skill.level ? 'bg-blue-400' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">
                      {skill.level === 1
                        ? 'Principiante'
                        : skill.level === 2
                        ? 'Básico'
                        : skill.level === 3
                        ? 'Intermedio'
                        : skill.level === 4
                        ? 'Avanzado'
                        : 'Experto'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}