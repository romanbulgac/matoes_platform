import { Typography } from '@/components/ui/typography-bundle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialService } from '@/services/materialService';
import { MaterialDto } from '@/types/api';
import { BookOpen, Download, FileText, Play, Star, Search, Filter, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function MaterialsPage() {
  // Setăm titlul paginii
  useSetPageTitle('Materiale Educaționale');
  
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // React Query pentru materiale
  const { data: materials, isLoading: materialsLoading } = useQuery({
    queryKey: ['student-materials', user?.id],
    queryFn: () => MaterialService.getForStudent(user!.id),
    enabled: !!user?.id,
  });

  const { data: recentMaterials, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-materials', user?.id],
    queryFn: () => MaterialService.getRecent(user!.id, 10),
    enabled: !!user?.id,
  });

  // Filtrare materiale
  const filteredMaterials = materials?.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || material.contentType?.includes(selectedType);
    const matchesSubject = selectedSubject === 'all' || material.title.toLowerCase().includes(selectedSubject.toLowerCase());
    
    return matchesSearch && matchesType && matchesSubject;
  }) || [];

  const handleDownload = async (materialId: string, materialTitle: string) => {
    try {
      const blob = await MaterialService.downloadMaterial(materialId);
      
      // Creează link pentru download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = materialTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  const getIcon = (contentType?: string) => {
    if (!contentType) return <FileText className="w-5 h-5" />;
    
    if (contentType.includes('video')) {
      return <Play className="w-5 h-5" />;
    } else if (contentType.includes('interactive') || contentType.includes('application')) {
      return <BookOpen className="w-5 h-5" />;
    } else {
      return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (contentType?: string) => {
    if (!contentType) return 'Document';
    
    if (contentType.includes('video')) {
      return 'Video';
    } else if (contentType.includes('interactive') || contentType.includes('application')) {
      return 'Interactiv';
    } else {
      return 'Document';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (materialsLoading) {
    return (
      <Typography.Section className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Typography.Section>
    );
  }

  return (
    <Typography.Section className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Typography.H1>
          Materiale Educaționale
        </Typography.H1>
        <Typography.Lead className="text-muted-foreground">
          Biblioteca digitală cu resurse de învățare pentru matematică - lecții, exerciții și materiale interactive
        </Typography.Lead>
      </div>

      {/* Search și filtre */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Caută materiale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filtrează
          </Button>
        </div>

        {/* Filtre rapide */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Toate
          </Button>
          <Button
            variant={selectedType === 'document' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('document')}
          >
            Documente
          </Button>
          <Button
            variant={selectedType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('video')}
          >
            Video-uri
          </Button>
          <Button
            variant={selectedType === 'interactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('interactive')}
          >
            Interactive
          </Button>
        </div>
      </div>

      {/* Statistici */}
      {materials && materials.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total materiale</p>
                  <p className="text-2xl font-bold">{materials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Descărcări totale</p>
                  <p className="text-2xl font-bold">
                    {materials.reduce((sum, m) => sum + (m.downloadCount || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Materiale recente</p>
                  <p className="text-2xl font-bold">{recentMaterials?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de materiale */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <Typography.H3 className="mb-2">Nu s-au găsit materiale</Typography.H3>
            <Typography.P className="text-muted-foreground mb-4">
              {searchQuery ? 'Încearcă să modifici criteriile de căutare' : 'Nu există materiale disponibile încă'}
            </Typography.P>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Șterge filtrele
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                      {getIcon(material.contentType)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline">{getTypeLabel(material.contentType)}</Badge>
                        {material.fileSize && (
                          <span>• {formatFileSize(material.fileSize)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(material.id, material.title)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {material.description && (
                  <Typography.P className="text-muted-foreground mb-4">
                    {material.description}
                  </Typography.P>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{material.downloadCount || 0}</span>
                    </div>
                    {material.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(material.createdAt).toLocaleDateString('ro-RO')}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDownload(material.id, material.title)}
                    size="sm"
                  >
                    Descarcă
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sugestii */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="text-center">
            <Typography.H3 className="text-primary-900 mb-2">
              Nu găsești ce cauți?
            </Typography.H3>
            <Typography.P className="text-muted-foreground mb-4">
              Profesorii noștri adaugă constant materiale noi. Poți să soliciti un anumit subiect sau să te înscrii la notificări pentru noutăți.
            </Typography.P>
            <div className="flex justify-center space-x-3">
              <Button>
                Solicită material
              </Button>
              <Button variant="outline">
                Abonează-te la noutăți
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Typography.Section>
  );
}