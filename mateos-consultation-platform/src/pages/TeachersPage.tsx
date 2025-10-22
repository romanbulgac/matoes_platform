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
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
// import { AspectRatio } from '@/components/ui/aspect-ratio';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  SlidersHorizontal, 
  Users, 
  Loader2, 
  // Star, 
  // Award, 
  // TrendingUp, 
  // Filter,
  Grid3X3,
  List,
  // MapPin,
  // Clock,
  GraduationCap,
  Sparkles,
  Zap,
  // Eye,
  // Heart,
  // Share2,
  // MoreHorizontal,
  X
} from 'lucide-react';
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

  // Premium marketplace features
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');
  // const [showTopRated, setShowTopRated] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  // const [favoriteTeachers, setFavoriteTeachers] = useState<string[]>([]);
  // const [selectedTeacher, setSelectedTeacher] = useState<TeacherWithStats | null>(null);

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
    // setShowTopRated(false);
  };

  const handleClearFilters = clearFilters;

  // Premium sorting and filtering
  // const sortedTeachers = teachers.sort((a, b) => {
  //   switch (sortBy) {
  //     case 'rating':
  //       return (b.AverageRating || 0) - (a.AverageRating || 0);
  //     case 'price':
  //       return (a.HourlyRate || 0) - (b.HourlyRate || 0);
  //     case 'experience':
  //       return (b.YearsOfExperience || 0) - (a.YearsOfExperience || 0);
  //     case 'name':
  //       return a.name.localeCompare(b.name);
  //     default:
  //       return 0;
  //   }
  // });

  // const filteredTeachers = showTopRated 
  //   ? sortedTeachers.filter(teacher => (teacher.AverageRating || 0) >= 4.5)
  //   : sortedTeachers;

  // const topRatedTeachers = teachers
  //   .filter(teacher => (teacher.AverageRating || 0) >= 4.5)
  //   .slice(0, 5);

  // const toggleFavorite = (teacherId: string) => {
  //   setFavoriteTeachers(prev => 
  //     prev.includes(teacherId) 
  //       ? prev.filter(id => id !== teacherId)
  //       : [...prev, teacherId]
  //   );
  // };

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
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <GraduationCap className="h-10 w-10 text-primary-600" />
              Profesorii Noștri
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </h1>
            <p className="text-lg text-muted-foreground">
              Găsește profesorul perfect pentru nevoile tale de studiu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Premium Filters Section */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <SlidersHorizontal className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Filtrează Profesorii</CardTitle>
                <p className="text-sm text-muted-foreground">Găsește profesorul perfect pentru tine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Căutare Avansată
              </Button>
              <Button onClick={handleClearFilters} variant="outline" size="sm" className="gap-2">
                <X className="h-4 w-4" />
                Resetează
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Premium Search Input */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Caută după nume, materie sau experiență..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-11 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Premium Subject Filter */}
            <div className="md:col-span-3">
              <Select onValueChange={handleSubjectChange} value={filters.subject || 'Toate materiile'}>
                <SelectTrigger className="h-11 border-primary-200 focus:border-primary-500">
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

            {/* Premium Rating Filter */}
            <div className="md:col-span-2">
              <Select onValueChange={handleMinRatingChange} value={filters.minRating?.toString() || 'all'}>
                <SelectTrigger className="h-11 border-primary-200 focus:border-primary-500">
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

            {/* Premium Action Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={handleSearch} className="flex-1 h-11 bg-primary-600 hover:bg-primary-700">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Caută
                  </>
                )}
              </Button>
              {Object.keys(filters).length > 0 && (
                <Button variant="outline" onClick={clearFilters} className="h-11">
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Results Count */}
      {!loading && teachers.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {teachers.length} {teachers.length === 1 ? 'Profesor Găsit' : 'Profesori Găsiți'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `Rezultate pentru "${searchQuery}"` : 'Toți profesorii disponibili'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sortează:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'rating' | 'price' | 'experience' | 'name')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Preț</SelectItem>
                <SelectItem value="experience">Experiență</SelectItem>
                <SelectItem value="name">Nume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Premium Teachers Grid */}
      {loading ? (
        renderLoadingSkeleton()
      ) : teachers.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};
