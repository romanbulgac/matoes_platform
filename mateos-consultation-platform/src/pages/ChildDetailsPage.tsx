import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FamilyService } from '@/services/familyService';
import type { ChildDetailDto, DeactivateAccountDto, ManageConsentDto } from '@/types';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Mail,
    Shield,
    ShieldAlert,
    TrendingUp,
    UserMinus,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ChildDetailsPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [child, setChild] = useState<ChildDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deleteData, setDeleteData] = useState(false);

  const loadChildDetails = async () => {
    if (!childId) return;

    try {
      setLoading(true);
      const data = await FamilyService.getChildDetails(childId);
      setChild(data);
    } catch (error) {
      console.error('Error loading child details:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca detaliile copilului',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  const handleConsentToggle = async (consentType: string, currentValue: boolean) => {
    if (!childId) return;

    try {
      const data: ManageConsentDto = {
        isGranted: !currentValue,
      };

      await FamilyService.manageChildConsent(childId, consentType, data);

      toast({
        title: 'Succes',
        description: `Consimțământul ${!currentValue ? 'acordat' : 'revocat'} cu succes`,
      });

      await loadChildDetails();
    } catch (error) {
      console.error('Error managing consent:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza consimțământul',
        variant: 'destructive',
      });
    }
  };

  const handleDeactivate = async () => {
    if (!childId || !deactivateReason.trim()) {
      toast({
        title: 'Eroare',
        description: 'Vă rugăm să specificați motivul dezactivării',
        variant: 'destructive',
      });
      return;
    }

    try {
      setDeactivating(true);

      const data: DeactivateAccountDto = {
        reason: deactivateReason,
        deleteData: deleteData,
      };

      await FamilyService.deactivateChild(childId, data);

      toast({
        title: 'Cont dezactivat',
        description: deleteData
          ? 'Contul și datele au fost șterse complet'
          : 'Contul a fost dezactivat. Poate fi reactivat oricând.',
      });

      navigate('/parent/dashboard');
    } catch (error) {
      console.error('Error deactivating child:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut dezactiva contul',
        variant: 'destructive',
      });
    } finally {
      setDeactivating(false);
    }
  };

  const getConsentIcon = (isGranted: boolean) => {
    return isGranted ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getConsentVariant = (isGranted: boolean): 'default' | 'destructive' => {
    return isGranted ? 'default' : 'destructive';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Copilul nu a fost găsit</p>
              <Button onClick={() => navigate('/parent/dashboard')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/parent/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <span>/</span>
        <span>Copii</span>
        <span>/</span>
        <span className="text-foreground font-medium">{child.name}</span>
      </div>

      {/* Header with Profile Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                  {getInitials(child.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{child.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {child.email}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={child.isActive ? 'default' : 'secondary'}>
                    {child.isActive ? 'Activ' : 'Inactiv'}
                  </Badge>
                  {child.childClass && (
                    <Badge variant="outline">Clasa {child.childClass}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid - Note: Backend should return these statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-blue-600" />
              Status Cont
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{child.isActive ? 'Activ' : 'Inactiv'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {child.enrollmentDate 
                ? `Creat: ${new Date(child.enrollmentDate).toLocaleDateString('ro-RO')}`
                : 'Membru'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-green-600" />
              Consimțăminte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {child.consents ? child.consents.filter(c => c.isGranted).length : 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              din {child.consents ? child.consents.length : 0} acordate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-purple-600" />
              Ultima Activitate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {child.lastLogin
                ? new Date(child.lastLogin).toLocaleDateString('ro-RO')
                : 'Niciodată'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Autentificare</p>
          </CardContent>
        </Card>
      </div>

      {/* Math Level & Progress */}
      {child.mathLevel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Nivel Matematică
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{child.mathLevel}</p>
                <p className="text-sm text-muted-foreground mt-1">Evaluare curentă</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {child.mathLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GDPR Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Consimțăminte GDPR
          </CardTitle>
          <CardDescription>
            Gestionați consimțămintele pentru procesarea datelor copilului
          </CardDescription>
        </CardHeader>
        <CardContent>
          {child.consents && child.consents.length > 0 ? (
            <div className="space-y-4">
              {child.consents.map((consent) => (
                <div
                  key={consent.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getConsentIcon(consent.isGranted)}
                    <div className="flex-1">
                      <p className="font-medium">{consent.consentTypeDisplayName || consent.consentType}</p>
                      <p className="text-sm text-muted-foreground">
                        Metodă: {consent.consentMethod || 'N/A'}
                        {consent.isParentalConsent && ' • Consimțământ parental'}
                      </p>
                      {consent.consentDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Acordat: {new Date(consent.consentDate).toLocaleDateString('ro-RO')}
                        </p>
                      )}
                      {consent.withdrawnDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Revocat: {new Date(consent.withdrawnDate).toLocaleDateString('ro-RO')}
                          {consent.withdrawalReason && ` - ${consent.withdrawalReason}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getConsentVariant(consent.isGranted)}>
                      {consent.isGranted ? 'Acordat' : 'Revocat'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConsentToggle(consent.consentType, consent.isGranted)}
                    >
                      {consent.isGranted ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Revocă
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acordă
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există consimțăminte înregistrate</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invitation History */}
      {child.invitationInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Istoric Invitație
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cont creat prin</span>
              <Badge variant="outline">{child.accountCreatedVia || 'Invitație'}</Badge>
            </div>
            {child.invitationInfo.status && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status invitație</span>
                <Badge variant={child.invitationInfo.status === 'Accepted' ? 'default' : 'outline'}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {child.invitationInfo.status}
                </Badge>
              </div>
            )}
            {child.invitationInfo.createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Invitație trimisă</span>
                <span className="text-sm font-medium">
                  {new Date(child.invitationInfo.createdAt).toLocaleDateString('ro-RO')}
                </span>
              </div>
            )}
            {child.lastLogin && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ultima autentificare</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(child.lastLogin).toLocaleDateString('ro-RO')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <ShieldAlert className="h-5 w-5" />
            Zonă Periculoasă
          </CardTitle>
          <CardDescription className="text-red-600">
            Acțiuni ireversibile. Procedați cu atenție.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <UserMinus className="mr-2 h-4 w-4" />
                Dezactivează Contul Copilului
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sunteți absolut sigur?</AlertDialogTitle>
                <AlertDialogDescription>
                  Această acțiune va dezactiva contul copilului <strong>{child.name}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="reason">Motiv dezactivare (obligatoriu)</Label>
                  <Textarea
                    id="reason"
                    placeholder="De ex: Nu mai are nevoie de meditații..."
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Checkbox
                    id="deleteData"
                    checked={deleteData}
                    onCheckedChange={(checked) => setDeleteData(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="deleteData"
                      className="text-sm font-medium leading-none text-red-700 cursor-pointer"
                    >
                      Șterge toate datele (GDPR - Dreptul de a fi uitat)
                    </Label>
                    <p className="text-xs text-red-600">
                      ⚠️ ATENȚIE: Această opțiune va șterge permanent toate datele copilului,
                      inclusiv istoricul consultațiilor. Acțiunea nu poate fi anulată.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {deleteData ? (
                      <>
                        <strong>Cu ștergere date:</strong> Toate datele vor fi șterse permanent.
                        Nu va mai putea fi reactivat.
                      </>
                    ) : (
                      <>
                        <strong>Fără ștergere date:</strong> Contul va fi doar dezactivat.
                        Datele rămân în sistem și pot fi reactivate oricând.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Anulează</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivate}
                  disabled={deactivating || !deactivateReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deactivating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Dezactivez...
                    </>
                  ) : (
                    <>Confirm Dezactivarea</>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
