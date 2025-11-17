'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

type PersonalInfo = {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
};

export function ContactSection({ personalInfo }: { personalInfo: PersonalInfo }) {
  return (
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
  );
}