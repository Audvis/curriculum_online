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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      }
    } catch (error) {
      console.error('Error saving education:', error);
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
      }
    } catch (error) {
      console.error('Error deleting education:', error);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Educación</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm sm:text-base h-9 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Agregar Educación
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingEducation ? 'Editar Educación' : 'Nueva Educación'}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm sm:text-base">
                Agrega tu formación académica
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="institution" className="text-white text-sm sm:text-base">Institución</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Nombre de la institución"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="degree" className="text-white text-sm sm:text-base">Título/Grado</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Licenciatura, Maestría, etc."
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="field" className="text-white text-sm sm:text-base">Campo de Estudio</Label>
                  <Input
                    id="field"
                    value={formData.field}
                    onChange={(e) => handleChange('field', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Ingeniería, Diseño, etc."
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
                <Label htmlFor="current" className="text-white text-sm sm:text-base">Estudiando actualmente</Label>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="description" className="text-white text-sm sm:text-base">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  placeholder="Describe tu formación, logros académicos, etc."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full text-sm sm:text-base h-9 sm:h-10"
              >
                {loading ? 'Guardando...' : (editingEducation ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {education.map((edu) => (
          <Card key={edu.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                    <h4 className="text-base sm:text-lg font-semibold text-white">{edu.degree}</h4>
                  </div>
                  <p className="text-blue-300 font-medium mb-1 text-sm sm:text-base">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-gray-300 mb-1.5 sm:mb-2 text-xs sm:text-sm">{edu.field}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>
                      {formatDate(edu.startDate)} - {edu.current ? 'Presente' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-300 text-xs sm:text-sm">{edu.description}</p>
                  )}
                </div>
                <div className="flex gap-1 sm:gap-2 self-end sm:self-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
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