'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Code, ExternalLink, Github, Star } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface ProjectFormProps {
  projects: Project[];
  onUpdate: () => void;
}

export function ProjectForm({ projects, onUpdate }: ProjectFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false
    });
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? '/api/projects' : '/api/projects';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProject ? { ...formData, id: editingProject.id } : formData),
      });

      if (response.ok) {
        onUpdate();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
      featured: project.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleChange = (field: keyof Omit<Project, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Proyectos</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm sm:text-base h-9 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Agregar Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm sm:text-base">
                Agrega tus proyectos destacados
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="title" className="text-white text-sm sm:text-base">Título del Proyecto</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="Nombre del proyecto"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="liveUrl" className="text-white text-sm sm:text-base">URL del Proyecto</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => handleChange('liveUrl', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="https://mi-proyecto.com"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="githubUrl" className="text-white text-sm sm:text-base">URL de GitHub</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="https://github.com/usuario/proyecto"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="imageUrl" className="text-white text-sm sm:text-base">URL de la Imagen</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-blue-600 w-4 h-4"
                />
                <Label htmlFor="featured" className="text-white text-sm sm:text-base">Proyecto destacado</Label>
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
                  placeholder="Describe el proyecto, sus funcionalidades y tus contribuciones..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full text-sm sm:text-base h-9 sm:h-10"
              >
                {loading ? 'Guardando...' : (editingProject ? 'Actualizar' : 'Agregar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <h4 className="text-base sm:text-lg font-semibold text-white truncate">{project.title}</h4>
                  {project.featured && (
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-1 sm:gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {project.description && (
                <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-3">{project.description}</p>
              )}

              {project.technologies && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.technologies.split(',').map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 sm:gap-3">
                {project.liveUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm h-8"
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Ver
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm h-8"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Código
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}