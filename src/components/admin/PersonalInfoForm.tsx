'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, User } from 'lucide-react';

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

interface PersonalInfoFormProps {
  data: PersonalInfo | null;
  onUpdate: () => void;
}

export function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    fullName: data?.fullName || '',
    title: data?.title || '',
    bio: data?.bio || '',
    email: data?.email || '',
    phone: data?.phone || '',
    location: data?.location || '',
    website: data?.website || '',
    github: data?.github || '',
    linkedin: data?.linkedin || '',
    avatar: data?.avatar || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = data?.id ? 'PUT' : 'POST';
      const response = await fetch('/api/personal-info', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="fullName" className="text-white text-sm sm:text-base">Nombre Completo</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="title" className="text-white text-sm sm:text-base">Título Profesional</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="Ej: Desarrollador Full Stack"
            required
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="phone" className="text-white text-sm sm:text-base">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="location" className="text-white text-sm sm:text-base">Ubicación</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="Ciudad, País"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="website" className="text-white text-sm sm:text-base">Sitio Web</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="https://tuwebsite.com"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="github" className="text-white text-sm sm:text-base">GitHub</Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="https://github.com/tuusuario"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="linkedin" className="text-white text-sm sm:text-base">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="https://linkedin.com/in/tuperfil"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
          <Label htmlFor="avatar" className="text-white text-sm sm:text-base">URL Avatar</Label>
          <Input
            id="avatar"
            value={formData.avatar}
            onChange={(e) => handleChange('avatar', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
            placeholder="URL de tu foto de perfil"
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="bio" className="text-white text-sm sm:text-base">Biografía</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
          placeholder="Cuéntanos sobre ti, tu experiencia y tus pasiones..."
          rows={5}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
      >
        <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
        {loading ? 'Guardando...' : 'Guardar Información'}
      </Button>
    </form>
  );
}