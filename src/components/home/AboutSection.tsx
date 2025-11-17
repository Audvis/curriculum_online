'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

type PersonalInfo = {
  fullName: string;
  title: string;
  bio: string;
  email?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
};

export function AboutSection({ personalInfo }: { personalInfo: PersonalInfo }) {
  return (
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
              transition={{ delay: 0.2, type: 'spring' }}
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
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all hover:scale-105"
              >
                <Mail size={20} />
                <span>Contactar</span>
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-105"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-105"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}