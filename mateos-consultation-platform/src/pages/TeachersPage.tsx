import { FC, useState, useEffect, useCallback } from 'react';
import { TeacherService, TeacherWithStats, TeacherFilters } from '@/services/teacherService';
import { TeacherCard } from '@/components/teachers/TeacherCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, SlidersHorizontal, Users, Loader2 } from 'lucide-react';
import { useAlert } from '@/hooks/use-alert';
import { Skeleton } from '@/components/ui/skeleton';

const SUBJECTS = [
  'Toate materiile',
  'Matematică - Algebră',
  'Matematică - Geometrie',
  'Matematică - Analiză matematică',
  'Matematică - Trigonometrie',
  'Matematică - Statistică',
  'Fizică',
  'Informatică',
];

export const TeachersPage: FC = () => {
  const [teachers, setTeachers] = useState<TeacherWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { showError } = useAlert();

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TeacherService.getTeachers(filters);
      setTeachers(data);
    } catch (error) {
      console.error('Eroare la încărcarea profesorilor:', error);
      showError(
        'Nu am putut încărca lista de profesori. Vă rugăm să încercați din nou.',
        'Eroare de încărcare'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery || undefined
    }));
  };

  const handleSubjectChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      subject: value === 'Toate materiile' ? undefined : value
    }));
  };

  const handleMinRatingChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      minRating: value === 'all' ? undefined : parseFloat(value)
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <CardTitle className="text-xl mb-2">
          Nu am găsit profesori
        </CardTitle>
        <CardDescription className="text-center mb-4">
          {Object.keys(filters).length > 0
            ? 'Încercați să modificați filtrele de căutare'
            : 'Momentan nu există profesori disponibili'}
        </CardDescription>
        {Object.keys(filters).length > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            Șterge filtrele
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Profesorii Noștri
        </h1>
        <p className="text-lg text-muted-foreground">
          Găsește profesorul perfect pentru nevoile tale de studiu
        </p>
      </div>

      {/* Filters Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary-600" />
            <CardTitle>Filtre de Căutare</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Caută după nume..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div className="md:col-span-3">
              <Select onValueChange={handleSubjectChange} value={filters.subject || 'Toate materiile'}>
                <SelectTrigger>
                  <SelectValue placeholder="Materie" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="md:col-span-2">
              <Select onValueChange={handleMinRatingChange} value={filters.minRating?.toString() || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Orice rating</SelectItem>
                  <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                  <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                  <SelectItem value="3.5">3.5+ ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Caută'
                )}
              </Button>
              {Object.keys(filters).length > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {!loading && teachers.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {teachers.length} {teachers.length === 1 ? 'profesor găsit' : 'profesori găsiți'}
          </p>
        </div>
      )}

      {/* Teachers Grid */}
      {loading ? (
        renderLoadingSkeleton()
      ) : teachers.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
};
