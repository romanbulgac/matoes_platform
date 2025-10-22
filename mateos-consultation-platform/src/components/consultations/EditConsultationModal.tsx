import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ConsultationService } from '@/services/consultationService';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO, set } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, CalendarIcon, Clock, Users } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface EditConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultationId: string | null;
  onSuccess?: () => void;
  className?: string;
}

// Zod схема валидации
const editConsultationSchema = z.object({
  title: z.string().min(3, 'Titlul trebuie să conțină cel puțin 3 caractere'),
  description: z.string().min(10, 'Descrierea trebuie să conțină cel puțin 10 caractere'),
  scheduledAt: z.date({
    required_error: 'Data și ora consultației sunt obligatorii',
  }),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Ora trebuie să fie în format HH:mm'),
  duration: z.number().min(15, 'Durata minimă este 15 minute').max(240, 'Durata maximă este 240 minute').optional(),
  maxParticipants: z.number().min(1, 'Minim 1 participant').max(20, 'Maxim 20 participanți').optional(),
  isGroupSession: z.boolean().optional(),
  link: z.string().refine((val) => val === '' || z.string().url().safeParse(val).success, {
    message: 'Link-ul trebuie să fie valid sau gol',
  }),
});

type EditConsultationFormData = z.infer<typeof editConsultationSchema>;

export const EditConsultationModal: FC<EditConsultationModalProps> = ({
  open,
  onOpenChange,
  consultationId,
  onSuccess,
  className
}) => {
  const [loading, setLoading] = useState(false);
  const [hasGroupId, setHasGroupId] = useState(false);
  
  const form = useForm<EditConsultationFormData>({
    resolver: zodResolver(editConsultationSchema),
    defaultValues: {
      title: '',
      description: '',
      scheduledAt: new Date(),
      scheduledTime: '10:00',
      duration: 60,
      maxParticipants: 1,
      isGroupSession: false,
      link: '',
    },
    mode: 'onSubmit',
  });

  // Логирование ошибок валидации для отладки
  const formErrors = form.formState.errors;
  if (Object.keys(formErrors).length > 0) {
    console.log('🔴 Form validation errors:', formErrors);
  }

  // Загружаем данные консультации при открытии модалки
  useEffect(() => {
    const loadConsultation = async () => {
      if (!consultationId || !open) return;
      
      try {
        setLoading(true);
        
        const consultation = await ConsultationService.getById(consultationId);
        
        // Парсим дату и время используя parseISO для правильной обработки ISO строки
        const scheduledDate = parseISO(consultation.scheduledAt);
        const scheduledTime = format(scheduledDate, 'HH:mm');
        
        // Установка флага наличия группы
        setHasGroupId(!!consultation.groupId);
        
        // Обновляем форму
        form.reset({
          title: consultation.title,
          description: consultation.description,
          scheduledAt: scheduledDate,
          scheduledTime: scheduledTime,
          duration: consultation.duration,
          maxParticipants: consultation.maxParticipants,
          isGroupSession: consultation.isGroupSession,
          link: consultation.link || '',
        });
      } catch (err) {
        console.error('❌ Error loading consultation:', err);
        toast.error('Nu s-a putut încărca consultația. Încercați din nou.');
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [consultationId, open, form]);

  const onSubmit = async (data: EditConsultationFormData) => {
    console.log('🚀 Form submitted with data:', data);
    
    if (!consultationId) {
      console.error('❌ No consultationId provided');
      return;
    }
    
    try {
      setLoading(true);
      console.log('💾 Updating consultation:', consultationId, data);
      
      // Комбинируем дату и время используя date-fns set
      const [hours, minutes] = data.scheduledTime.split(':').map(Number);
      const scheduledDateTime = set(data.scheduledAt, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });
      
      // Форматируем дату в ISO формат БЕЗ конвертации в UTC
      // Используем format вместо toISOString() чтобы сохранить локальное время
      const scheduledAtString = format(scheduledDateTime, "yyyy-MM-dd'T'HH:mm:ss");
      
      console.log('📅 Local time selected:', format(scheduledDateTime, 'yyyy-MM-dd HH:mm:ss'));
      console.log('📤 Sending to API:', scheduledAtString);
      
      // Форматируем данные для API
      const updateData = {
        title: data.title,
        description: data.description,
        scheduledAt: scheduledAtString,
        duration: data.duration ?? 60,
        maxParticipants: data.maxParticipants ?? 1,
        isGroupSession: data.isGroupSession ?? false,
        link: data.link,
      };
      
      await ConsultationService.update(consultationId, updateData);
      console.log('✅ Consultation updated successfully');
      
      toast.success('Consultația a fost actualizată cu succes!');
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Error updating consultation:', err);
      toast.error('Nu s-a putut actualiza consultația. Verificați datele și încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle>
            Editează Consultația
          </DialogTitle>
          <DialogDescription>
            Modifică informațiile consultației matematice.
          </DialogDescription>
        </DialogHeader>

        {loading && !form.getValues('title') ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Se încarcă datele consultației...</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titlul Consultației</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Algebră liniară - Sisteme de ecuații"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrierea Consultației</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrie subiectele care vor fi abordate în această consultație..."
                        className="min-h-[80px]"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meeting Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link pentru Consultația Online</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Adaugă link-ul pentru Zoom, Google Meet, Microsoft Teams sau altă platformă
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Picker */}
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="date-picker" className="px-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Data Consultației
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className={cn(
                                "justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={loading}
                            >
                              {field.value ? format(field.value, "PPP", { locale: ro }) : "Alegeți data"}
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Picker */}
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="time-picker" className="px-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ora
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          id="time-picker"
                          step="60"
                          {...field}
                          disabled={loading}
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration field - только для консультаций без группы */}
              {!hasGroupId && (
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Durata (minute)
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString() ?? '60'}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minute</SelectItem>
                          <SelectItem value="45">45 minute</SelectItem>
                          <SelectItem value="60">60 minute</SelectItem>
                          <SelectItem value="90">90 minute</SelectItem>
                          <SelectItem value="120">120 minute</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* IsGroupSession field - только для консультаций без группы */}
              {!hasGroupId && (
                <FormField
                  control={form.control}
                  name="isGroupSession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Tipul Sesiunii
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "group")}
                        value={field.value === true ? "group" : "individual"}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individuală</SelectItem>
                          <SelectItem value="group">De Grup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* MaxParticipants field - только для групповых консультаций без группы */}
              {!hasGroupId && (
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numărul Max. de Participanți</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={loading || !form.watch('isGroupSession')}
                        />
                      </FormControl>
                      <FormDescription>
                        Disponibil doar pentru sesiuni de grup
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleClose(false)}
                  disabled={loading}
                >
                  Anulează
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Se salvează...' : 'Salvează Modificările'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};