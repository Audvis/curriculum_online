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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      }
    } catch (error) {
      console.error('Error saving experience:', error);
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
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Experiencias Laborales</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm sm:text-base h-9 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Agregar Experiencia
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm sm:text-base">
                Agrega tu experiencia laboral profesional
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="company" className="text-white text-sm sm:text-base">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Nombre de la empresa"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="position" className="text-white text-sm sm:text-base">Posición</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Tu cargo"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="startDate" className="text-white text-sm sm:text-base">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white text-sm sm:text-base h-9 sm:h-10"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="endDate" className="text-white text-sm sm:text-base">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white text-sm sm:text-base h-9 sm:h-10"
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
                  className="rounded border-white/20 bg-white/10 text-blue-600 w-4 h-4"
                />
                <Label htmlFor="current" className="text-white text-sm sm:text-base">Trabajo actual</Label>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="technologies" className="text-white text-sm sm:text-base">Tecnologías</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => handleChange('technologies', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                  placeholder="React, Node.js, TypeScript, etc."
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="description" className="text-white text-sm sm:text-base">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  placeholder="Describe tus responsabilidades y logros..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full text-sm sm:text-base h-9 sm:h-10"
              >
                {loading ? 'Guardando...' : (editingExperience ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {experiences.map((experience) => (
          <Card key={experience.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                    <h4 className="text-base sm:text-lg font-semibold text-white">{experience.position}</h4>
                  </div>
                  <p className="text-blue-300 font-medium mb-1 text-sm sm:text-base">{experience.company}</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>
                      {formatDate(experience.startDate)} - {experience.current ? 'Presente' : formatDate(experience.endDate)}
                    </span>
                  </div>
                  {experience.description && (
                    <p className="text-gray-300 mb-2 sm:mb-3 text-xs sm:text-sm">{experience.description}</p>
                  )}
                  {experience.technologies && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {experience.technologies.split(',').map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 sm:gap-2 self-end sm:self-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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