/**
 * MaterialsViewer - Component pentru vizualizarea materialelor
 * 
 * Funcționalitate:
 * - Upload și view de bază
 * - Preview pentru PDF/imagini
 * - Download individual și în masă
 * - Empty state
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Eye, 
  File, 
  FileText, 
  Image, 
  Loader2 
} from 'lucide-react';
import { FC, useState } from 'react';

interface Material {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  canPreview: boolean;
  downloadUrl?: string;
}

interface MaterialsViewerProps {
  materials: Material[];
  consultationTitle?: string;
  onDownload?: (materialId: string) => void;
  onDownloadAll?: () => void;
  onPreview?: (materialId: string) => void;
}

export const MaterialsViewer: FC<MaterialsViewerProps> = ({
  materials,
  consultationTitle,
  onDownload,
  onDownloadAll,
  onPreview
}) => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    }
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const handleDownload = async (material: Material) => {
    try {
      setDownloading(material.id);
      
      // Simulate download - replace with actual download logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would call the actual download service
      // await MaterialService.downloadMaterial(material.id);
      
      onDownload?.(material.id);
      
      toast({
        title: 'Succes',
        description: `${material.fileName} a fost descărcat`,
      });
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut descărca fișierul',
        variant: 'destructive',
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setDownloadingAll(true);
      
      // Simulate download all - replace with actual download logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would call the actual download all service
      // await MaterialService.downloadAllMaterials(materials.map(m => m.id));
      
      onDownloadAll?.();
      
      toast({
        title: 'Succes',
        description: 'Toate materialele au fost descărcate',
      });
    } catch (error) {
      console.error('Error downloading all materials:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut descărca toate materialele',
        variant: 'destructive',
      });
    } finally {
      setDownloadingAll(false);
    }
  };

  const handlePreview = (material: Material) => {
    if (material.canPreview) {
      onPreview?.(material.id);
    }
  };

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Niciun material încărcat</h3>
            <p className="text-sm">
              {consultationTitle 
                ? `Profesorul nu a încărcat încă materiale pentru "${consultationTitle}"`
                : 'Nu există materiale disponibile'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Materiale Consultație
            </CardTitle>
            {consultationTitle && (
              <CardDescription>{consultationTitle}</CardDescription>
            )}
          </div>
          
          {materials.length > 1 && (
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              variant="outline"
              size="sm"
            >
              {downloadingAll ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Se descarcă...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descarcă Toate
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(material.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{material.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(material.fileSize)} • Încărcat {formatDate(material.uploadedAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de {material.uploadedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    {/* Preview Button */}
                    {material.canPreview && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreview(material)}
                        title="Vezi preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Download Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(material)}
                      disabled={downloading === material.id}
                      title="Descarcă fișierul"
                    >
                      {downloading === material.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Preview for images */}
                {material.canPreview && material.fileType.startsWith('image/') && (
                  <div className="mt-3">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handlePreview(material)}
                      className="p-0 h-auto text-blue-600"
                    >
                      Vezi imaginea
                    </Button>
                  </div>
                )}
                
                {/* Preview for PDFs */}
                {material.canPreview && material.fileType.includes('pdf') && (
                  <div className="mt-3">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handlePreview(material)}
                      className="p-0 h-auto text-blue-600"
                    >
                      Deschide PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {materials.length} material{materials.length !== 1 ? 'e' : ''} disponibil{materials.length !== 1 ? 'e' : ''}
            </span>
            <span>
              Total: {formatFileSize(materials.reduce((sum, m) => sum + m.fileSize, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
