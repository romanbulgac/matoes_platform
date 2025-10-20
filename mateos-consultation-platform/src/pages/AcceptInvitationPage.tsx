import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FamilyService } from '@/services/familyService';
import type { AcceptChildInvitationDto, InvitationInfoDto } from '@/types';
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    Lock,
    Mail,
    User,
    UserPlus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AcceptInvitationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Loading states
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Invitation info
  const [invitationInfo, setInvitationInfo] = useState<InvitationInfoDto | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // GDPR consents are managed by parent, not child

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      setValidationError('Token-ul de invitație lipsește');
      setLoadingInfo(false);
      return;
    }

    loadInvitationInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadInvitationInfo = async () => {
    if (!token) return;

    try {
      setLoadingInfo(true);
      setValidationError(null);
      
      const info = await FamilyService.getInvitationInfo(token);
      
      if (!info.isValid) {
        setValidationError(info.errorMessage || 'Invitația este invalidă');
        return;
      }

      // Check if invitation is expired by comparing expiresAt with current date
      if (info.expiresAt && new Date(info.expiresAt) < new Date()) {
        setValidationError('Invitația a expirat');
        return;
      }

      setInvitationInfo(info);
    } catch (error) {
      console.error('Error loading invitation info:', error);
      setValidationError('Nu s-a putut încărca informația despre invitație');
    } finally {
      setLoadingInfo(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email incorect';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (password.length < 6) {
      newErrors.password = 'Parola trebuie să conțină minim 6 caractere';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmarea parolei este obligatorie';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }

    // GDPR consents are managed by parent, not child

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    try {
      setSubmitting(true);

      const acceptData: AcceptChildInvitationDto = {
        invitationToken: token,
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword, // Backend requires this field
        name: invitationInfo?.childName || '',
        surname: invitationInfo?.childSurname || '',
        userAgent: navigator.userAgent,
      };

      const result = await FamilyService.acceptInvitation(acceptData);

      if (!result.isSuccess) {
        toast({
          title: 'Eroare',
          description: result.errorMessage || 'Nu s-a putut accepta invitația',
          variant: 'destructive',
        });
        return;
      }

      // Automatically login the user with received tokens
      if (result.accessToken && result.user) {
        // Save tokens to localStorage (same pattern as AuthContext)
        localStorage.setItem('authToken', result.accessToken);
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
        
        // Convert UserDto to User and save
        const user = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          surname: result.user.surname,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        toast({
          title: 'Succes!',
          description: 'Contul a fost creat cu succes. Bun venit!',
        });

        // Redirect to student dashboard - page will reload and AuthContext will pick up the tokens
        window.location.href = '/student/dashboard';
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Eroare',
        description: 'A apărut o eroare la crearea contului',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loadingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-muted-foreground">Se încarcă informațiile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (validationError || !invitationInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Invitație Invalidă</CardTitle>
                <CardDescription>Nu puteți continua cu această invitație</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
              variant="outline"
            >
              Înapoi la Pagina Principală
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Acceptă Invitația</CardTitle>
              <CardDescription>Creează-ți contul de elev</CardDescription>
            </div>
          </div>

          {/* Invitation Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <p className="text-sm">
                    <span className="font-semibold">Părinte:</span> {invitationInfo.parentName}
                  </p>
                </div>
                {invitationInfo.parentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <p className="text-sm">
                      <span className="font-semibold">Email părinte:</span> {invitationInfo.parentEmail}
                    </p>
                  </div>
                )}
                {invitationInfo.expiresAt && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-700">
                      <span className="font-semibold">Valabil până:</span>{' '}
                      {new Date(invitationInfo.expiresAt).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email * <Mail className="inline h-4 w-4 ml-1" />
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Parola * <Lock className="inline h-4 w-4 ml-1" />
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minim 6 caractere"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmă Parola * <Lock className="inline h-4 w-4 ml-1" />
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Reintrodu parola"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* GDPR consents are managed by parent */}

            {/* Info Alert */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Contul tău va fi asociat cu părintele <strong>{invitationInfo.parentName}</strong>.
                După creare, vei avea acces la platforma educațională.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se creează contul...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Creează Cont și Acceptă Invitația
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              * Câmpuri obligatorii
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
