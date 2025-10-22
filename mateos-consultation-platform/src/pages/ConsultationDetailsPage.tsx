import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConsultationService } from '@/services/consultationService';
import { ReviewService } from '@/services/reviewService';
import { FileService } from '@/services/fileService';
import { ConsultationDto, ConsultationStatus, ConsultationType } from '@/types/api';
import { parseScheduledDate } from '@/utils/dateUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Award,
  TrendingUp,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { FC, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ConsultationDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMeetingLink, setShowMeetingLink] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: consultation, isLoading } = useQuery<ConsultationDto>({
    queryKey: ['consultation', id],
    queryFn: () => ConsultationService.getById(id!),
    enabled: !!id,
  });

  // Загружаем файлы консультации отдельно
  const { data: consultationFiles = [], isLoading: isLoadingFiles } = useQuery({
    queryKey: ['consultationFiles', id],
    queryFn: () => FileService.getConsultationFiles(id!),
    enabled: !!id,
  });

  // Мутация для обновления посещаемости
  const attendanceMutation = useMutation({
    mutationFn: async ({ studentId, attended }: { studentId: string; attended: boolean }) => {
      console.log('Update attendance:', { consultationId: id, studentId, attended });
      await ConsultationService.updateAttendance(id!, studentId, attended);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      toast({
        title: 'Succes',
        description: 'Prezența a fost actualizată',
      });
    },
    onError: (error) => {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza prezența',
        variant: 'destructive',
      });
      console.error('Attendance update error:', error);
    }
  });

  // Мутация для выставления оценки (использует ReviewsController)
  const ratingMutation = useMutation({
    mutationFn: async ({ studentId, rating, comment }: { studentId: string; rating: number; comment?: string }) => {
      console.log('Create/update review:', { consultationId: id, studentId, rating, comment });
      return ReviewService.create({
        consultationId: id!,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      toast({
        title: 'Succes',
        description: 'Nota a fost acordată',
      });
    },
    onError: (error) => {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut acorda nota',
        variant: 'destructive',
      });
      console.error('Rating creation error:', error);
    }
  });

  // Мутация для загрузки материалов
  const uploadMaterialsMutation = useMutation({
    mutationFn: async (files: File[]) => {
      console.log('📤 Starting upload mutation:', {
        filesCount: files.length,
        consultationId: id,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });
      
      // Валидируем каждый файл
      for (const file of files) {
        console.log('🔍 Validating file:', file.name);
        const validation = FileService.validateFile(file);
        if (!validation.valid) {
          console.error('❌ Validation failed:', validation.error);
          throw new Error(validation.error);
        }
        console.log('✅ Validation passed for:', file.name);
      }

      // Загружаем файлы последовательно
      const results = [];
      for (const file of files) {
        console.log('📤 Uploading file:', file.name);
        const result = await FileService.uploadConsultationFile(id!, file);
        console.log('✅ Upload result:', result);
        results.push(result);
      }
      
      console.log('🎉 All files uploaded successfully:', results);
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      queryClient.invalidateQueries({ queryKey: ['consultationFiles', id] });
      setSelectedFiles([]);
      toast({
        title: 'Succes',
        description: 'Materialele au fost încărcate',
      });
    },
    onError: (error) => {
      toast({
        title: 'Eroare',
        description: error instanceof Error ? error.message : 'Nu s-au putut încărca materialele',
        variant: 'destructive',
      });
      console.error('Materials upload error:', error);
    },
  });

  const getStatusBadge = (status: ConsultationStatus) => {
    const badges = {
      [ConsultationStatus.Scheduled]: (
        <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Planificată
        </Badge>
      ),
      [ConsultationStatus.InProgress]: (
        <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
          <Video className="h-3 w-3 mr-1" />
          În desfășurare
        </Badge>
      ),
      [ConsultationStatus.Completed]: (
        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Finalizată
        </Badge>
      ),
      [ConsultationStatus.Cancelled]: (
        <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Anulată
        </Badge>
      ),
    };
    return badges[status] || null;
  };

  const formatDate = (dateString: string) => {
    return parseScheduledDate(dateString).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return parseScheduledDate(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEndTime = (dateString: string, duration: number) => {
    const start = parseScheduledDate(dateString);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadMaterial = async (fileId: string) => {
    try {
      console.log('📥 Downloading file:', fileId);
      await FileService.downloadAndSave(fileId);
      toast({
        title: 'Succes',
        description: 'Materialul a fost descărcat',
      });
    } catch (error) {
      console.error('❌ Download error:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut descărca materialul',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('📂 Files dropped:', files.map(f => ({ name: f.name, size: f.size })));
    setSelectedFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('📂 Files selected via input:', files.map(f => ({ name: f.name, size: f.size })));
    setSelectedFiles(files);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto h-12 w-12" />
          <p className="text-muted-foreground">Se încarcă datele consultației...</p>
        </div>
      </div>
    );
  }

  if (!consultation && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-600">Eroare</h3>
          </div>
          <p className="text-slate-600 mb-6">
            Nu s-a putut încărca consultația. Vă rugăm încercați din nou.
          </p>
          <Button 
            onClick={() => navigate('/consultations')}
            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
          >
            Înapoi la consultații
          </Button>
        </Card>
      </div>
    );
  }

  // Если consultation не загружена или недоступна, не продолжаем рендеринг
  if (!consultation) {
    return null;
  }

  const isTeacher = user?.role === 'Teacher';
  const isParent = user?.role === 'Parent';
  const isStudent = user?.role === 'Student';
  
  // Получаем список участников из consultation
  const participants = consultation.participants || [];
  const materials = consultationFiles; // Используем файлы из отдельного запроса
  const meetingLink = consultation.link;
  
  console.log('📋 Consultation data:', {
    id: consultation.id,
    participants: participants.length,
    materials: materials.length,
    materialsData: materials,
    consultationFiles,
    isLoadingFiles,
    consultationData: consultation
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
          onClick={() => navigate('/consultations')}
            variant="ghost"
            className="hover:bg-white/50 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Înapoi la consultații
          </Button>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        </div>

        {/* Premium Header Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-6 overflow-hidden w-full">
          <CardHeader className="bg-gradient-to-r from-primary-500 to-purple-600 text-white w-full">
            <div className="flex items-start justify-between overflow-hidden w-full">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start gap-3 mb-2 w-full">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden max-w-full">
                    <h2 className="text-2xl sm:text-3xl text-white mb-2 font-bold" style={{ 
                      wordBreak: 'break-word', 
                      overflowWrap: 'anywhere', 
                      hyphens: 'auto',
                      maxWidth: '100%',
                      width: '100%'
                    }}>
                      {consultation.title}
                    </h2>
                    {getStatusBadge(consultation.status)}
                  </div>
                </div>
                <p className="text-white/90 text-base" style={{ 
                  wordBreak: 'break-word', 
                  overflowWrap: 'anywhere',
                  hyphens: 'auto'
                }}>
                  {consultation.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Data */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium">Data</p>
                  <p className="font-semibold text-blue-900 text-sm">{formatDate(consultation.scheduledAt)}</p>
                </div>
              </div>

              {/* Ora */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <div className="p-3 bg-green-500 rounded-full">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-700 font-medium">Interval</p>
                  <p className="font-semibold text-green-900 text-sm">
                    {formatTime(consultation.scheduledAt)} - {formatEndTime(consultation.scheduledAt, consultation.duration)}
                  </p>
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <div className="p-3 bg-purple-500 rounded-full">
                  {consultation.consultationType === ConsultationType.Group ? (
                    <Users className="w-5 h-5 text-white" />
                  ) : (
                    <Video className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-purple-700 font-medium">Tip</p>
                  <p className="font-semibold text-purple-900 text-sm">
                    {consultation.consultationType === ConsultationType.Group ? 'Grup' : 'Individual'}
                  </p>
                </div>
              </div>

              {/* Durată */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                <div className="p-3 bg-orange-500 rounded-full">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-orange-700 font-medium">Durată</p>
                  <p className="font-semibold text-orange-900">{consultation.duration} min</p>
                </div>
              </div>
            </div>

            {/* Meeting Link - for all roles */}
            {meetingLink && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Link Consultație Online</p>
                      <p className="text-xs text-blue-700">Click pentru a vizualiza link-ul</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMeetingLink(!showMeetingLink)}
                    className="border-blue-300 hover:bg-blue-100"
                  >
                    {showMeetingLink ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showMeetingLink ? 'Ascunde' : 'Arată'}
                  </Button>
                </div>
                {showMeetingLink && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      <a 
                        href={meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex-1 truncate text-sm"
                      >
                        {meetingLink}
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(meetingLink);
                          toast({ title: 'Link copiat!', description: 'Link-ul a fost copiat în clipboard' });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-based Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teacher View */}
            {isTeacher && (
              <>
                {/* Attendance & Grades Management */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      Gestionare Prezență și Note
                    </CardTitle>
                    <CardDescription>
                      Marchează prezența și acordă note elevilor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {participants.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Încă nu sunt participanți înregistrați</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {participants.map((student) => (
                          <div 
                            key={student.id}
                            className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="h-10 w-10 border-2 border-primary-200 flex-shrink-0">
                                  <AvatarFallback className="bg-gradient-to-br from-primary-100 to-purple-100 text-primary-700">
                                    {student.name[0]}{student.surname[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{student.name} {student.surname}</p>
                                  <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`attendance-${student.id}`} className="text-sm">
                                    Prezent
                                  </Label>
                                  <Switch
                                    id={`attendance-${student.id}`}
                                    onCheckedChange={(checked) => 
                                      attendanceMutation.mutate({ studentId: student.id, attended: checked })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Label htmlFor={`rating-${student.id}`} className="text-sm font-medium">
                                Notă:
                              </Label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() => ratingMutation.mutate({ studentId: student.id, rating })}
                                    className="w-8 h-8 rounded-lg border-2 font-semibold text-sm transition-all bg-white border-gray-300 text-gray-600 hover:bg-gradient-to-br hover:from-yellow-400 hover:to-yellow-500 hover:border-yellow-600 hover:text-white"
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upload Materials */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                        <Upload className="h-5 w-5 text-blue-600" />
                      </div>
                      Încarcă Materiale
                    </CardTitle>
                    <CardDescription>
                      Adaugă resurse educaționale pentru elevi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                          isDragging 
                            ? 'border-primary-500 bg-primary-50 scale-105' 
                            : 'border-gray-300 hover:border-primary-400 bg-gradient-to-br from-blue-50 to-purple-50'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className={`h-12 w-12 mx-auto mb-3 transition-colors ${
                          isDragging ? 'text-primary-700' : 'text-primary-600'
                        }`} />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {isDragging ? 'Eliberează pentru a încărca' : 'Click sau trage fișiere aici'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX, PPT, PPTX (max 10MB)
                        </p>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={handleFileInputChange}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                          />
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                            onClick={() => {
                              console.log('🖱️ Upload button clicked!', {
                                selectedFilesCount: selectedFiles.length,
                                files: selectedFiles.map(f => f.name)
                              });
                              uploadMaterialsMutation.mutate(selectedFiles);
                            }}
                            disabled={uploadMaterialsMutation.isPending}
                          >
                            {uploadMaterialsMutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Se încarcă...
                              </div>
                            ) : (
                              'Încarcă Materialele'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Parent View */}
            {isParent && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    Prezența Copilului Meu
                  </CardTitle>
                  <CardDescription>
                    Informații despre participarea la consultație
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {participants.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Informații despre prezență nu sunt disponibile</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {participants.map((child) => (
                        <div key={child.id} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16 border-4 border-white shadow-lg flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-bold">
                                {child.name[0]}{child.surname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-bold text-gray-900 truncate">{child.name} {child.surname}</h4>
                              <p className="text-sm text-muted-foreground truncate">{child.email}</p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border-2 border-green-200">
                              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                              <p className="text-xs text-muted-foreground mb-1">Status</p>
                              <p className="font-bold text-green-700">Înregistrat</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-200">
                              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                              <p className="text-xs text-muted-foreground mb-1">Notă</p>
                              <p className="font-bold text-yellow-700">-</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Student View */}
            {isStudent && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    Performanța Mea
                  </CardTitle>
                  <CardDescription>
                    Nota și feedback pentru această consultație
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Performance Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                        <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-600" />
                        <p className="text-xs text-green-700 font-medium mb-1">Status</p>
                        <p className="text-lg font-bold text-green-800">Înregistrat</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                        <Star className="h-10 w-10 mx-auto mb-3 text-yellow-600" />
                        <p className="text-xs text-yellow-700 font-medium mb-1">Notă</p>
                        <p className="text-2xl font-bold text-yellow-800">-</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                        <TrendingUp className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                        <p className="text-xs text-blue-700 font-medium mb-1">Progres</p>
                        <p className="text-lg font-bold text-blue-800">-</p>
                      </div>
                    </div>

                    {/* Teacher Feedback */}
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">Feedback Profesor</p>
                          <p className="text-xs text-muted-foreground truncate">{consultation.teacherName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                        Feedback-ul va fi disponibil după finalizarea consultației.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Materials (visible to all) */}
          <div className="space-y-6">
            {/* Materials Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden w-full">
              <CardHeader className="w-full">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  Materiale
                </CardTitle>
                <CardDescription>
                  Resurse educaționale pentru această lecție
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFiles ? (
                  <div className="text-center py-8">
                    <Spinner className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm text-muted-foreground">Se încarcă materialele...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Încă nu sunt materiale disponibile</p>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    {materials.map((file) => (
                      <div 
                        key={file.id}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all hover:shadow-md overflow-hidden w-full"
                      >
                        <div className="flex items-center justify-between gap-3 w-full overflow-hidden">
                          <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                              <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <p className="font-medium text-sm text-gray-900" style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                              }}>
                                {file.fileName}
                              </p>
                              <p className="text-xs text-muted-foreground" style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                              }}>
                                {file.contentType} • {(file.fileSize / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-orange-50 flex-shrink-0"
                            onClick={() => handleDownloadMaterial(file.id)}
                          >
                            <Download className="h-4 w-4 text-orange-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  Statistici Rapide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-muted-foreground">Participanți</span>
                    <span className="font-bold text-primary-600">
                      {participants.length}/{consultation.maxParticipants || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-muted-foreground">Materiale</span>
                    <span className="font-bold text-orange-600">{materials.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-muted-foreground">Preț</span>
                    <span className="font-bold text-green-600">{consultation.price} Lei</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
