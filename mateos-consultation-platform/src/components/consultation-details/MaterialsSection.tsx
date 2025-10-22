import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationDto } from '@/types/api';
import { Download, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { FC, useRef, useState } from 'react';

interface MaterialsSectionProps {
  consultation: ConsultationDto;
}

export const MaterialsSection: FC<MaterialsSectionProps> = ({ consultation }) => {
  const [materials, setMaterials] = useState(consultation.materials || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: API call to upload files
      console.log('Uploading files:', files);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating upload
      
      // Mock new material
      const newMaterial = {
        id: `mat-${Date.now()}`,
        title: files[0].name,
        filename: files[0].name,
        fileSize: files[0].size,
        contentType: files[0].type,
        teacherId: consultation.teacherId,
        consultationId: consultation.id,
        isPublic: true,
        downloadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setMaterials(prev => [...prev, newMaterial]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (materialId: string) => {
    try {
      // TODO: API call to delete material
      console.log('Deleting material:', materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleDownload = (material: typeof materials[0]) => {
    // TODO: Implement download logic
    console.log('Downloading:', material.title);
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <Typography.H3 className="text-lg">Materiale</Typography.H3>
          </div>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary hover:bg-primary-600"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-1 animate-pulse" />
                Se încarcă...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Adaugă
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {materials.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <Typography.P className="text-slate-500 mb-4">
              Niciun material adăugat
            </Typography.P>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adaugă primul material
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map(material => (
              <div
                key={material.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography.P className="font-medium truncate">
                      {material.title}
                    </Typography.P>
                    <Typography.Small className="text-slate-500">
                      {formatFileSize(material.fileSize)} • {material.downloadCount} descărcări
                    </Typography.Small>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(material)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(material.id)}
                    className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
