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
    <section id="skills" className="py-12 sm:py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        >
          Habilidades
        </motion.h2>

        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-300 mb-4 sm:mb-6 text-center">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {categorySkills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all text-center"
                  >
                    <div className="text-white font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">{skill.name}</div>
                    <div className="flex justify-center mb-1.5 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mx-0.5 ${i < skill.level ? 'bg-blue-400' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400">
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