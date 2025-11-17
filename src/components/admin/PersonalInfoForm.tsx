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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const method = data?.id ? 'PUT' : 'POST';
      const body = data?.id ? { ...formData, id: data.id } : formData;

      const response = await fetch('/api/personal-info', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccess(true);
        onUpdate();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al guardar la información');
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Nombre Completo</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Título Profesional</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="Ej: Desarrollador Full Stack"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-white">Ubicación</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="Ciudad, País"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-white">Sitio Web</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="https://tuwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="text-white">GitHub</Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="https://github.com/tuusuario"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="https://linkedin.com/in/tuperfil"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar" className="text-white">URL Avatar</Label>
          <Input
            id="avatar"
            value={formData.avatar}
            onChange={(e) => handleChange('avatar', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="URL de tu foto de perfil"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">Biografía</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
          placeholder="Cuéntanos sobre ti, tu experiencia y tus pasiones..."
          rows={5}
        />
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-green-500/20 border border-green-500/50 text-green-200">
          Información guardada correctamente
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        <Save className="w-4 h-4 mr-2" />
        {loading ? 'Guardando...' : 'Guardar Información'}
      </Button>
    </form>
  );
}