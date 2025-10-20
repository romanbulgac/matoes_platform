import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FamilyService } from '@/services/familyService';
import type { ManageConsentDto, UserConsentDto } from '@/types';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Info,
    Loader2,
    ShieldAlert,
    ShieldCheck,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

interface ConsentManagementPanelProps {
  childId: string;
  childName: string;
  consents: UserConsentDto[];
  onConsentUpdated?: () => void;
}

interface ConsentTypeInfo {
  type: string;
  displayName: string; // ✅ FIXED: camelCase to match UserConsentDto
  description: string;
  isRequired: boolean;
  category: 'essential' | 'functional' | 'optional';
}

const CONSENT_TYPES: ConsentTypeInfo[] = [
  {
    type: 'Privacy',
    displayName: 'Politica de Confidențialitate',
    description: 'Acord pentru colectarea și procesarea datelor personale conform GDPR',
    isRequired: true,
    category: 'essential',
  },
  {
    type: 'Terms',
    displayName: 'Termeni și Condiții',
    description: 'Acceptarea termenilor de utilizare a platformei educaționale',
    isRequired: true,
    category: 'essential',
  },
  {
    type: 'DataProcessing',
    displayName: 'Procesare Date',
    description: 'Consimțământ pentru procesarea datelor în scopuri educaționale',
    isRequired: true,
    category: 'essential',
  },
  {
    type: 'AttendanceTracking',
    displayName: 'Urmărire Prezență',
    description: 'Monitorizare prezență la cursuri și consultații',
    isRequired: true,
    category: 'functional',
  },
  {
    type: 'PaymentTracking',
    displayName: 'Evidență Plăți',
    description: 'Gestionarea plăților și abonamentelor',
    isRequired: true,
    category: 'functional',
  },
  {
    type: 'PerformanceTracking',
    displayName: 'Urmărire Performanță',
    description: 'Monitorizare progres academic și rezultate',
    isRequired: false,
    category: 'functional',
  },
  {
    type: 'GroupPlacement',
    displayName: 'Plasare în Grupuri',
    description: 'Plasarea elevului în grupuri de studiu corespunzătoare',
    isRequired: false,
    category: 'functional',
  },
  {
    type: 'ScheduleTracking',
    displayName: 'Gestionare Program',
    description: 'Sincronizare program și notificări despre cursuri',
    isRequired: false,
    category: 'functional',
  },
  {
    type: 'Marketing',
    displayName: 'Comunicări Marketing',
    description: 'Primire informații despre oferte și promoții',
    isRequired: false,
    category: 'optional',
  },
  {
    type: 'Cookies',
    displayName: 'Cookie-uri',
    description: 'Utilizare cookie-uri pentru îmbunătățirea experienței',
    isRequired: false,
    category: 'optional',
  },
  {
    type: 'ParentalConsent',
    displayName: 'Consimțământ Parental',
    description: 'Confirmare consimțământ parental pentru minor',
    isRequired: true,
    category: 'essential',
  },
];

export const ConsentManagementPanel: React.FC<ConsentManagementPanelProps> = ({
  childId,
  childName,
  consents,
  onConsentUpdated,
}) => {
  const { toast } = useToast();
  const [updatingConsent, setUpdatingConsent] = useState<string | null>(null);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [selectedConsentType, setSelectedConsentType] = useState<string | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState('');

  const getConsentStatus = (consentType: string): UserConsentDto | null => {
    return consents.find(c => c.consentType === consentType) || null;
  };

  const handleToggleConsent = async (consentType: string, currentlyGranted: boolean) => {
    const consentInfo = CONSENT_TYPES.find(ct => ct.type === consentType);
    
    if (!currentlyGranted && consentInfo?.isRequired) {
      toast({
        title: 'Avertisment',
        description: `${consentInfo.displayName} este obligatoriu și nu poate fi retras.`,
        variant: 'destructive',
      });
      return;
    }

    if (currentlyGranted) {
      // Show withdrawal dialog
      setSelectedConsentType(consentType);
      setShowWithdrawDialog(true);
    } else {
      // Grant consent directly
      await updateConsent(consentType, true, undefined);
    }
  };

  const updateConsent = async (
    consentType: string, 
    isGranted: boolean, 
    reason?: string
  ) => {
    try {
      setUpdatingConsent(consentType);

      const data: ManageConsentDto = {
        isGranted,
        reason: reason || undefined,
      };

      await FamilyService.manageChildConsent(childId, consentType, data);

      toast({
        title: 'Succes',
        description: isGranted 
          ? 'Consimțământul a fost acordat'
          : 'Consimțământul a fost retras',
      });

      // Callback to refresh child details
      if (onConsentUpdated) {
        onConsentUpdated();
      }

      // Close dialog if open
      setShowWithdrawDialog(false);
      setSelectedConsentType(null);
      setWithdrawalReason('');
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza consimțământul',
        variant: 'destructive',
      });
    } finally {
      setUpdatingConsent(null);
    }
  };

  const handleWithdrawConsent = async () => {
    if (!selectedConsentType) return;

    if (!withdrawalReason.trim()) {
      toast({
        title: 'Atenție',
        description: 'Vă rugăm să specificați motivul retragerii',
        variant: 'destructive',
      });
      return;
    }

    await updateConsent(selectedConsentType, false, withdrawalReason);
  };

  const renderConsentStatus = (consent: UserConsentDto | null, _consentInfo: ConsentTypeInfo) => {
    if (!consent) {
      return (
        <Badge variant="outline" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Neacordat
        </Badge>
      );
    }

    if (consent.isGranted && consent.isActive) {
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Activ
        </Badge>
      );
    }

    if (consent.withdrawnDate) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Retras
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Inactiv
      </Badge>
    );
  };

  const renderConsentsByCategory = (category: 'essential' | 'functional' | 'optional') => {
    const categoryConsents = CONSENT_TYPES.filter(ct => ct.category === category);

    const categoryTitles = {
      essential: 'Consimțăminte Esențiale',
      functional: 'Consimțăminte Funcționale',
      optional: 'Consimțăminte Opționale',
    };

    const categoryIcons = {
      essential: <ShieldCheck className="h-5 w-5 text-red-600" />,
      functional: <ShieldAlert className="h-5 w-5 text-blue-600" />,
      optional: <Info className="h-5 w-5 text-gray-600" />,
    };

    return (
      <Card key={category} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {categoryIcons[category]}
            <CardTitle className="text-lg">{categoryTitles[category]}</CardTitle>
          </div>
          <CardDescription>
            {category === 'essential' && 'Aceste consimțăminte sunt obligatorii pentru utilizarea platformei'}
            {category === 'functional' && 'Consimțăminte necesare pentru funcționalități specifice'}
            {category === 'optional' && 'Consimțăminte opționale pentru servicii suplimentare'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryConsents.map((consentInfo) => {
            const consent = getConsentStatus(consentInfo.type);
            const isGranted = !!(consent?.isGranted && consent?.isActive);
            const isUpdating = updatingConsent === consentInfo.type;

            return (
              <div
                key={consentInfo.type}
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor={`consent-${consentInfo.type}`}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {consentInfo.displayName}
                    </Label>
                    {renderConsentStatus(consent, consentInfo)}
                    {consentInfo.isRequired && (
                      <Badge variant="outline" className="text-xs">
                        Obligatoriu
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {consentInfo.description}
                  </p>

                  {consent && (
                    <div className="text-xs text-muted-foreground space-y-1 pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          Acordat: {new Date(consent.consentDate).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      {consent.withdrawnDate && (
                        <>
                          <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-3 w-3" />
                            <span>
                              Retras: {new Date(consent.withdrawnDate).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          {consent.withdrawalReason && (
                            <div className="ml-5 text-red-600">
                              Motiv: {consent.withdrawalReason}
                            </div>
                          )}
                        </>
                      )}
                      {consent.consentMethod && (
                        <div className="flex items-center gap-2">
                          <Info className="h-3 w-3" />
                          <span>Metodă: {consent.consentMethod}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    id={`consent-${consentInfo.type}`}
                    checked={isGranted}
                    onCheckedChange={() => handleToggleConsent(consentInfo.type, isGranted)}
                    disabled={isUpdating || (consentInfo.isRequired && isGranted)}
                  />
                  {isUpdating && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Gestionare Consimțăminte GDPR</CardTitle>
              <CardDescription>
                Administrați consimțămintele pentru <strong>{childName}</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Consimțămintele marcate ca <strong>Obligatorii</strong> sunt necesare pentru 
              utilizarea platformei și nu pot fi retrase. Retra gerea celorlalte consimțăminte 
              poate limita funcționalitățile disponibile.
            </AlertDescription>
          </Alert>

          {renderConsentsByCategory('essential')}
          {renderConsentsByCategory('functional')}
          {renderConsentsByCategory('optional')}
        </CardContent>
      </Card>

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retragere Consimțământ</DialogTitle>
            <DialogDescription>
              Sunteți pe cale să retrageți consimțământul pentru{' '}
              <strong>
                {CONSENT_TYPES.find(ct => ct.type === selectedConsentType)?.displayName}
              </strong>
              . Vă rugăm să specificați motivul retragerii.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawal-reason">Motivul retragerii *</Label>
              <Textarea
                id="withdrawal-reason"
                placeholder="Specificați motivul pentru care retrageți acest consimțământ..."
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Retragerea acestui consimțământ poate afecta funcționalitățile disponibile 
                pentru {childName}.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowWithdrawDialog(false);
                setSelectedConsentType(null);
                setWithdrawalReason('');
              }}
            >
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={handleWithdrawConsent}
              disabled={!withdrawalReason.trim() || updatingConsent !== null}
            >
              {updatingConsent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se retrage...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Retrage Consimțământul
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
