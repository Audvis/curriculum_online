'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Briefcase, Calendar } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  technologies: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onUpdate: () => void;
}

export function ExperienceForm({ experiences, onUpdate }: ExperienceFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: ''
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      technologies: ''
    });
    setEditingExperience(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = editingExperience ? 'PUT' : 'POST';
      const url = '/api/experience';

      const baseBody = editingExperience
        ? { ...formData, id: editingExperience.id }
        : { ...formData };

      const body = {
        ...baseBody,
        endDate: baseBody.current || !baseBody.endDate ? null : baseBody.endDate,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onUpdate();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al guardar la experiencia');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      technologies: experience.technologies
    });
    setError(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) return;

    try {
      const response = await fetch(`/api/experience?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al eliminar la experiencia');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error de conexión al eliminar');
    }
  };

  const handleChange = (field: keyof Omit<Experience, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Presente';
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Experiencias Laborales</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Experiencia
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Agrega tu experiencia laboral profesional
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-white">Posición</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Tu cargo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-white">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => handleChange('current', e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-purple-600"
                />
                <Label htmlFor="current" className="text-white">Trabajo actual</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies" className="text-white">Tecnologías</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => handleChange('technologies', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="React, Node.js, TypeScript, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                  placeholder="Describe tus responsabilidades y logros..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
              >
                {loading ? 'Guardando...' : (editingExperience ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-white">{experience.position}</h4>
                  </div>
                  <p className="text-purple-300 font-medium mb-1">{experience.company}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(experience.startDate)} - {experience.current ? 'Presente' : formatDate(experience.endDate)}
                    </span>
                  </div>
                  {experience.description && (
                    <p className="text-gray-300 mb-3">{experience.description}</p>
                  )}
                  {experience.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.split(',').map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}