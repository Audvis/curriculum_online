'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface EducationFormProps {
  education: Education[];
  onUpdate: () => void;
}

export function EducationForm({ education, onUpdate }: EducationFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false
    });
    setEditingEducation(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = editingEducation ? 'PUT' : 'POST';
      const url = '/api/education';

      const baseBody = editingEducation
        ? { ...formData, id: editingEducation.id }
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
        setError(errorData.error || 'Error al guardar la educación');
      }
    } catch (error) {
      console.error('Error saving education:', error);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      description: education.description,
      startDate: education.startDate,
      endDate: education.endDate,
      current: education.current
    });
    setError(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta educación?')) return;

    try {
      const response = await fetch(`/api/education?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al eliminar la educación');
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Error de conexión al eliminar');
    }
  };

  const handleChange = (field: keyof Omit<Education, 'id'>, value: string | boolean) => {
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
        <h3 className="text-xl font-semibold text-white">Educación</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Educación
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? 'Editar Educación' : 'Nueva Educación'}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Agrega tu formación académica
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-white">Institución</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nombre de la institución"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-white">Título/Grado</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Licenciatura, Maestría, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field" className="text-white">Campo de Estudio</Label>
                  <Input
                    id="field"
                    value={formData.field}
                    onChange={(e) => handleChange('field', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ingeniería, Diseño, etc."
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
                <Label htmlFor="current" className="text-white">Estudiando actualmente</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                  placeholder="Describe tu formación, logros académicos, etc."
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
                {loading ? 'Guardando...' : (editingEducation ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                  </div>
                  <p className="text-purple-300 font-medium mb-1">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-gray-300 mb-2">{edu.field}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(edu.startDate)} - {edu.current ? 'Presente' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-300">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
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