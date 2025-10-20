import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography-bundle';
import { cn } from '@/lib/utils';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { FC, useState } from 'react';

interface CreateConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateConsultationFormData) => void;
  className?: string;
}

export interface CreateConsultationFormData {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  isGroupSession: boolean;
  price: number;
}

export const CreateConsultationModal: FC<CreateConsultationModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  className
}) => {
  const [formData, setFormData] = useState<CreateConsultationFormData>({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
    maxParticipants: 1,
    isGroupSession: false,
    price: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      scheduledAt: '',
      duration: 60,
      maxParticipants: 1,
      isGroupSession: false,
      price: 50
    });
  };

  const handleInputChange = (field: keyof CreateConsultationFormData) => 
    (value: string | number | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle>
            <Typography.H3 className="mb-0">
              Creează Consultație Nouă
            </Typography.H3>
          </DialogTitle>
          <DialogDescription>
            <Typography.P className="text-muted-foreground">
              Completează informațiile necesare pentru a programa o nouă consultație matematică.
            </Typography.P>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Titlul Consultației *
            </Label>
            <Input
              id="title"
              placeholder="ex: Algebră liniară - Sisteme de ecuații"
              value={formData.title}
              onChange={(e) => handleInputChange('title')(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrierea Consultației *
            </Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Descrie subiectele care vor fi abordate în această consultație..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description')(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data și Ora *
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt')(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Durata (minute) *
              </Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => handleInputChange('duration')(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minute</SelectItem>
                  <SelectItem value="45">45 minute</SelectItem>
                  <SelectItem value="60">60 minute</SelectItem>
                  <SelectItem value="90">90 minute</SelectItem>
                  <SelectItem value="120">120 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Type and Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Tipul Sesiunii
              </Label>
              <Select
                value={formData.isGroupSession ? "group" : "individual"}
                onValueChange={(value) => handleInputChange('isGroupSession')(value === "group")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individuală</SelectItem>
                  <SelectItem value="group">De Grup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm font-medium">
                Numărul Max. de Participanți
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="20"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants')(parseInt(e.target.value) || 1)}
                disabled={!formData.isGroupSession}
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Preț (RON) *
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price')(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Anulează
            </Button>
            <Button type="submit">
              Creează Consultația
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};