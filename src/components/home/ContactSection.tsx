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
    <section id="contact" className="py-12 sm:py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        >
          Contacto
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base break-all">
                <Mail className="text-blue-400 flex-shrink-0" size={18} />
                <span className="truncate">{personalInfo.email}</span>
              </a>
            )}
            {personalInfo.phone && (
              <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">
                <Phone className="text-blue-400 flex-shrink-0" size={18} />
                <span>{personalInfo.phone}</span>
              </a>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                <MapPin className="text-blue-400 flex-shrink-0" size={18} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">
                <Globe className="text-blue-400 flex-shrink-0" size={18} />
                <span>Website</span>
              </a>
            )}
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20 flex justify-center gap-4 sm:gap-6">
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors p-2">
                <Github size={22} className="sm:w-6 sm:h-6" />
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors p-2">
                <Linkedin size={22} className="sm:w-6 sm:h-6" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}