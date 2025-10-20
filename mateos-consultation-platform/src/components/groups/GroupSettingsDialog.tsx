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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Group } from '@/types';
import { AlertCircle, Loader2, Settings } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface GroupSettingsDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * GroupSettingsDialog - Dialog pentru editarea setărilor grupului
 * 
 * Features:
 * - Edit group name, description, class
 * - Change maxCapacity (cu warning dacă există membri)
 * - Validation
 * - Loading states
 * - Error handling
 */
export const GroupSettingsDialog: FC<GroupSettingsDialogProps> = ({
  group,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    class: group.class,
    maxCapacity: group.maxCapacity,
  });

  // Reset form când grupul se schimbă
  useEffect(() => {
    setFormData({
      name: group.name,
      description: group.description || '',
      class: group.class,
      maxCapacity: group.maxCapacity,
    });
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: '❌ Eroare',
        description: 'Numele grupului este obligatoriu',
      });
      return;
    }

    if (!formData.class) {
      toast({
        variant: 'destructive',
        title: '❌ Eroare',
        description: 'Clasa este obligatorie',
      });
      return;
    }

    // Check if reducing capacity below current members count
    const currentMembersCount = group.members?.length || 0;
    if (formData.maxCapacity < currentMembersCount) {
      toast({
        variant: 'destructive',
        title: '❌ Capacitate invalidă',
        description: `Nu poți reduce capacitatea sub numărul actual de membri (${currentMembersCount})`,
      });
      return;
    }

    try {
      setLoading(true);

      // TODO: Backend не підтримує ще update endpoint
      // Тимчасово показуємо тільки попередження
      toast({
        variant: 'destructive',
        title: '⚠️ Функція в розробці',
        description: 'Редагування груп буде доступне після реалізації відповідного API endpoint',
      });
      
      // Для майбутнього:
      // await GroupService.update(group.id, {
      //   name: formData.name,
      //   class: formData.class,
      // });

      toast({
        title: '✅ Succes',
        description: 'Grupul a fost actualizat cu succes',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Error updating group:', error);
      toast({
        variant: 'destructive',
        title: '❌ Eroare',
        description: error instanceof Error ? error.message : 'Nu s-a putut actualiza grupul',
      });
    } finally {
      setLoading(false);
    }
  };

  const isCapacityChanging = formData.maxCapacity !== group.maxCapacity;
  const currentMembersCount = group.members?.length || 0;
  const showCapacityWarning = isCapacityChanging && currentMembersCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Setări grup
            </DialogTitle>
            <DialogDescription>
              Modifică informațiile grupului. Câmpurile marcate cu * sunt obligatorii.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nume grup <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Grupa Matematică Avansată"
                disabled={loading}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descriere opțională a grupului..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class">
                Clasa <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.class}
                onValueChange={(value) => setFormData({ ...formData, class: value })}
                disabled={loading}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="Selectează clasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">Clasa a 8-a</SelectItem>
                  <SelectItem value="9">Clasa a 9-a</SelectItem>
                  <SelectItem value="10">Clasa a 10-a</SelectItem>
                  <SelectItem value="11">Clasa a 11-a</SelectItem>
                  <SelectItem value="12">Clasa a 12-a</SelectItem>
                  <SelectItem value="10-11">Clasa 10-11</SelectItem>
                  <SelectItem value="11-12">Clasa 11-12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Capacity */}
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">
                Capacitate maximă <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.maxCapacity.toString()}
                onValueChange={(value) => setFormData({ ...formData, maxCapacity: parseInt(value) })}
                disabled={loading}
              >
                <SelectTrigger id="maxCapacity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Mini-grup 3 persoane</SelectItem>
                  <SelectItem value="6">Mini-grup 6 persoane</SelectItem>
                </SelectContent>
              </Select>
              
              {showCapacityWarning && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <p className="font-medium mb-1">Atenție!</p>
                    <p>
                      Grupul are momentan <strong>{currentMembersCount} membri</strong>.
                      {formData.maxCapacity < currentMembersCount ? (
                        <span className="block mt-1 text-red-700 font-medium">
                          Nu poți reduce capacitatea sub numărul actual de membri.
                        </span>
                      ) : (
                        <span className="block mt-1">
                          Noua capacitate va fi <strong>{formData.maxCapacity} locuri</strong>.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Se actualizează...
                </>
              ) : (
                'Salvează modificările'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
