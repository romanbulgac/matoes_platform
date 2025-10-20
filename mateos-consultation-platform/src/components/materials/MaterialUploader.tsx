/**
 * MaterialUploader - Component pentru încărcarea materialelor
 * 
 * Funcționalitate:
 * - Upload și view de bază
 * - Drag & drop zone
 * - File list cu progress
 * - Asociere cu consultații
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  File, 
  FileText, 
  Image, 
  Loader2, 
  Upload, 
  X 
} from 'lucide-react';
import { FC, useCallback, useState } from 'react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  uploading: boolean;
  error?: string;
}

interface MaterialUploaderProps {
  consultationId?: string;
  consultations?: Array<{ id: string; title: string; scheduledAt: string }>;
  onUploadComplete?: (files: UploadFile[]) => void;
}

export const MaterialUploader: FC<MaterialUploaderProps> = ({
  consultationId,
  consultations = [],
  onUploadComplete
}) => {
  const { toast } = useToast();
  
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<string>(consultationId || '');
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-600" />;
    }
    if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-600" />;
    }
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return 'Fișierul este prea mare. Maxim 10MB.';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Tipul de fișier nu este suportat.';
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          uploading: false
        });
      }
    });

    if (errors.length > 0) {
      toast({
        title: 'Eroare de validare',
        description: errors.join(', '),
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFile = async (file: UploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, uploading: true, progress: 0 }
          : f
      ));

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress }
            : f
        ));
      }

      // Here you would call the actual upload service
      // await MaterialService.uploadFile(file.file, selectedConsultation);

      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, uploading: false, progress: 100 }
          : f
      ));

      toast({
        title: 'Succes',
        description: `${file.file.name} a fost încărcat cu succes`,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, uploading: false, error: 'Eroare la încărcare' }
          : f
      ));
    }
  };

  const uploadAll = async () => {
    if (!selectedConsultation) {
      toast({
        title: 'Eroare',
        description: 'Selectează o consultație',
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = files.filter(f => !f.uploading && f.progress === 0);
    
    for (const file of filesToUpload) {
      await uploadFile(file);
    }

    onUploadComplete?.(files);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Încarcă Materiale
        </CardTitle>
        <CardDescription>
          Încarcă materiale pentru consultații (PDF, DOC, imagini)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Trage fișierele aici sau{' '}
            <label htmlFor="file-input" className="text-blue-600 hover:text-blue-500 cursor-pointer">
              selectează
            </label>
          </p>
          <p className="text-sm text-muted-foreground">
            Formate acceptate: PDF, DOC, DOCX, PNG, JPG, GIF, TXT. Max 10 MB per fișier.
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Fișiere selectate ({files.length})</h3>
            
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.file.type)}
                  <div>
                    <p className="font-medium">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Upload Progress */}
                  {file.uploading && (
                    <div className="w-32">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.progress}%
                      </p>
                    </div>
                  )}
                  
                  {/* Error */}
                  {file.error && (
                    <div className="text-red-600 text-sm">
                      {file.error}
                    </div>
                  )}
                  
                  {/* Success */}
                  {file.progress === 100 && !file.uploading && (
                    <div className="text-green-600 text-sm">
                      Încărcat
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                    disabled={file.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consultation Selection */}
        {consultations.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="consultation">Asociază cu consultația</Label>
            <Select value={selectedConsultation} onValueChange={setSelectedConsultation}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează consultația" />
              </SelectTrigger>
              <SelectContent>
                {consultations.map((consultation) => (
                  <SelectItem key={consultation.id} value={consultation.id}>
                    {consultation.title} - {formatDate(consultation.scheduledAt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={uploadAll}
              disabled={files.some(f => f.uploading) || !selectedConsultation}
              className="min-w-[140px]"
            >
              {files.some(f => f.uploading) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Se încarcă...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Încarcă Toate ({files.length})
                </>
              )}
            </Button>
          </div>
        )}

        {/* Warnings */}
        {files.length > 0 && !selectedConsultation && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Selectează o consultație înainte de a încărca fișierele.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
