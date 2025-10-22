import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FamilyService } from '@/services/familyService';
import type { ChildInvitationResponseDto, CreateChildInvitationDto } from '@/types';
import { ChildInvitationOptions } from '@/types/api';
import { Check, Copy, ExternalLink, UserPlus } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

interface InviteChildDialogProps {
  onInviteCreated?: () => void;
  children?: ReactNode;
}

export const InviteChildDialog: FC<InviteChildDialogProps> = ({ onInviteCreated, children }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState<ChildInvitationResponseDto | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Form fields for new invitation
  const [childEmail, setChildEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childSurname, setChildSurname] = useState('');
  const [childClass, setChildClass] = useState('');
  const [mathLevel, setMathLevel] = useState('');

  const handleCreateInvite = async () => {
    if (!childEmail.trim() || !childName.trim() || !childSurname.trim()) {
      toast({
        title: 'Eroare',
        description: 'Vă rugăm completați toate câmpurile obligatorii',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const invitationData: CreateChildInvitationDto = {
        childemail: childEmail.trim(),
        childName: childName.trim(),
        childSurname: childSurname.trim(),
        childClass: childClass || undefined,
        mathLevel: mathLevel || undefined,
      };
      
      const newInvite = await FamilyService.createInvitation(invitationData);
      setInvite(newInvite);
      
      toast({
        title: 'Link de invitație generat',
        description: `Invitație trimisă la ${childEmail}`,
      });

      onInviteCreated?.();
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut crea invitația',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!invite) return;

    try {
      await navigator.clipboard.writeText(invite.invitationLink);
      setCopied(true);
      toast({
        title: 'Link copiat',
        description: 'Link-ul a fost copiat în clipboard',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut copia link-ul',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInvite(null);
    setChildEmail('');
    setChildName('');
    setChildSurname('');
    setChildClass('');
    setMathLevel('');
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invită Copil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Invită Copil</DialogTitle>
          <DialogDescription>
            Generați un link de invitație pentru copilul dumneavoastră. 
            Link-ul este valabil 7 zile și poate fi folosit o singură dată.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!invite ? (
            // Step 1: Create invitation form
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Completați datele copilului pentru a genera un link de invitație.
                  Link-ul va fi trimis pe email și va fi valabil 7 zile.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="child-email">Email Copil *</Label>
                <Input
                  id="child-email"
                  type="email"
                  placeholder="copil@example.com"
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="child-name">Prenume *</Label>
                  <Input
                    id="child-name"
                    placeholder="Ion"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-surname">Nume *</Label>
                  <Input
                    id="child-surname"
                    placeholder="Popescu"
                    value={childSurname}
                    onChange={(e) => setChildSurname(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="child-class">Clasă</Label>
                  <Select value={childClass} onValueChange={setChildClass} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează clasa" />
                    </SelectTrigger>
                    <SelectContent>
                      {ChildInvitationOptions.classOptions.map((classOption) => (
                        <SelectItem key={classOption} value={classOption}>
                          Clasa {classOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="math-level">Nivel Matematică</Label>
                  <Select value={mathLevel} onValueChange={setMathLevel} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează nivelul" />
                    </SelectTrigger>
                    <SelectContent>
                      {ChildInvitationOptions.mathLevelOptions.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCreateInvite} 
                disabled={loading || !childEmail || !childName || !childSurname}
                className="w-full"
              >
                {loading ? 'Se trimite...' : 'Trimite Invitație'}
              </Button>
            </div>
          ) : (
            // Step 2: Show generated link
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-green-600">
                  ✓ Invitație creată cu succes! Link-ul a fost trimis pe email.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="invite-link">Link de Invitație</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-link"
                    value={invite.invitationLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>email: <strong>{invite.childemail}</strong></p>
                <p>Token: <code className="text-xs bg-muted px-1 py-0.5 rounded">{invite.invitationToken}</code></p>
                <p>Status: <strong>{invite.status}</strong></p>
                <p>Expiră la: {new Date(invite.expiresAt).toLocaleString('ro-RO')}</p>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Copilul va primi un email cu link-ul de invitație.
                  Poate folosi și link-ul de mai sus dacă nu primește email-ul.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copiat!' : 'Copiază Link'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(invite.invitationLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Deschide
                </Button>
              </div>

              <Button 
                onClick={handleClose}
                className="w-full"
                variant="secondary"
              >
                Închide
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
