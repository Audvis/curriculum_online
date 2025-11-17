'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Award, Zap } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface SkillsFormProps {
  skills: Skill[];
  onUpdate: () => void;
}

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Base de Datos',
  'DevOps',
  'Mobile',
  'Design',
  'Otros'
];

const LEVEL_LABELS = {
  1: 'Principiante',
  2: 'Básico',
  3: 'Intermedio',
  4: 'Avanzado',
  5: 'Experto'
};

const LEVEL_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-purple-500'
};

export function SkillsForm({ skills, onUpdate }: SkillsFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: 'Frontend',
    level: 3
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      level: 3
    });
    setEditingSkill(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingSkill ? 'PUT' : 'POST';
      const url = editingSkill ? '/api/skills' : '/api/skills';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSkill ? { ...formData, id: editingSkill.id } : formData),
      });

      if (response.ok) {
        onUpdate();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) return;

    try {
      const response = await fetch(`/api/skills?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleChange = (field: keyof Omit<Skill, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Habilidades</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm sm:text-base h-9 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Agregar Habilidad
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingSkill ? 'Editar Habilidad' : 'Nueva Habilidad'}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm sm:text-base">
                Agrega tus competencias técnicas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-white text-sm sm:text-base">Nombre de la Habilidad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                  placeholder="React, Python, etc."
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="category" className="text-white text-sm sm:text-base">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm sm:text-base h-9 sm:h-10">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="text-white text-sm sm:text-base">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="level" className="text-white text-sm sm:text-base">Nivel</Label>
                <Select
                  value={formData.level.toString()}
                  onValueChange={(value) => handleChange('level', parseInt(value))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm sm:text-base h-9 sm:h-10">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {Object.entries(LEVEL_LABELS).map(([level, label]) => (
                      <SelectItem key={level} value={level} className="text-white text-sm sm:text-base">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-white text-sm sm:text-base">Vista Previa del Nivel</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${LEVEL_COLORS[formData.level as keyof typeof LEVEL_COLORS]} transition-all duration-300`}
                      style={{ width: `${(formData.level / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300 min-w-[60px]">
                    {LEVEL_LABELS[formData.level as keyof typeof LEVEL_LABELS]}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full text-sm sm:text-base h-9 sm:h-10"
              >
                {loading ? 'Guardando...' : (editingSkill ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Card key={category} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-white font-medium text-sm sm:text-base truncate">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden max-w-[100px] sm:max-w-[120px]">
                          <div
                            className={`h-full ${LEVEL_COLORS[skill.level as keyof typeof LEVEL_COLORS]} transition-all duration-300`}
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-300">
                          {LEVEL_LABELS[skill.level as keyof typeof LEVEL_LABELS]}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                        className="text-gray-400 hover:text-white hover:bg-white/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}