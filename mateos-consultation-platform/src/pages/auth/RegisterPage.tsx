import { Logo } from '@/components/Logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useFadeIn } from '@/hooks/useGsap';
import { UserRole } from '@/types';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const roleLabels: Record<UserRole, string> = {
  Student: 'Student',
  Teacher: 'Profesor',
  Administrator: 'Administrator',
  Parent: 'Părinte',
  student: 'Student',
  teacher: 'Profesor',
  admin: 'Administrator',
};

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'Student' as UserRole,
    hasAcceptedPrivacyPolicy: false,
    hasAcceptedTerms: false,
    hasAcceptedMarketing: false,
    hasAcceptedCookies: false,
    hasAcceptedAttendanceTracking: false,
    hasAcceptedPaymentTracking: false,
    hasAcceptedGroupPlacement: false,
    hasAcceptedScheduleTracking: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const containerRef = useFadeIn<HTMLDivElement>([], { y: 10 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Parolele nu se potrivesc');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Parola trebuie să conțină minimum 6 caractere');
      return false;
    }
    if (!formData.hasAcceptedPrivacyPolicy) {
      setError('Trebuie să accepți Politica de Confidențialitate');
      return false;
    }
    if (!formData.hasAcceptedTerms) {
      setError('Trebuie să accepți Termenii și Condițiile');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const session = await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        role: formData.role,
        hasAcceptedPrivacyPolicy: formData.hasAcceptedPrivacyPolicy,
        hasAcceptedTerms: formData.hasAcceptedTerms,
        hasAcceptedMarketing: formData.hasAcceptedMarketing,
        hasAcceptedCookies: formData.hasAcceptedCookies,
        hasAcceptedAttendanceTracking: formData.hasAcceptedAttendanceTracking,
        hasAcceptedPaymentTracking: formData.hasAcceptedPaymentTracking,
        hasAcceptedGroupPlacement: formData.hasAcceptedGroupPlacement,
        hasAcceptedScheduleTracking: formData.hasAcceptedScheduleTracking,
      });
      
      // Informăm utilizatorul că înregistrarea a fost cu succes
      if (session) {
        console.log('Înregistrare cu succes, sesiune creată:', session);
      }
      
      navigate('/dashboard');
  } catch {
      setError('Eroare la înregistrare. Utilizatorul cu acest email există deja.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div ref={containerRef} className="max-w-md w-full space-y-6">
        {/* Logo și titlu */}
        <div className="text-center">
          <div className="mx-auto mb-1">
            <Logo size="xl" variant="rounded" className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Creează cont
          </h2>
          <p className="text-gray-600">
            Alătură-te platformei Mateos
          </p>
        </div>

        {/* Formular de înregistrare */}
        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Eroare */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Prenume și Nume */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">Prenume</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  placeholder="Ion"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastname">Nume</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  placeholder="Popescu"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Adresa email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="email@exemplu.ro"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Rol */}
            <div>
              <Label htmlFor="role">Sunt</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData((p) => ({ ...p, role: v as UserRole }))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Alege rolul" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parola */}
            <div>
              <Label htmlFor="password">Parola</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="pr-10"
                  placeholder="Minimum 6 caractere"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmarea parolei */}
            <div>
              <Label htmlFor="confirmPassword">Confirmă parola</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="pr-10"
                  placeholder="Repetă parola"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Telefon (opțional) */}
            <div>
              <Label htmlFor="phoneNumber">Număr de telefon (opțional)</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+40 XXX XXX XXX"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Acord cu termenii - OBLIGATORIU */}
            <div className="space-y-4 border-t pt-4">
              <p className="text-sm font-semibold text-gray-700">Acorduri necesare (obligatoriu)</p>
              
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedPrivacyPolicy" 
                  checked={formData.hasAcceptedPrivacyPolicy}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedPrivacyPolicy: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedPrivacyPolicy" className="text-sm font-normal cursor-pointer">
                  Accept{' '}
                  <a href="/privacy" target="_blank" className="font-medium text-primary-600 hover:text-primary-500">
                    Politica de Confidențialitate
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedTerms" 
                  checked={formData.hasAcceptedTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedTerms: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedTerms" className="text-sm font-normal cursor-pointer">
                  Accept{' '}
                  <a href="/terms" target="_blank" className="font-medium text-primary-600 hover:text-primary-500">
                    Termenii și Condițiile
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
            </div>

            {/* Acorduri opționale */}
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-semibold text-gray-700">Acorduri opționale</p>
              
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedCookies" 
                  checked={formData.hasAcceptedCookies}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedCookies: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedCookies" className="text-sm font-normal cursor-pointer">
                  Accept utilizarea cookie-urilor pentru îmbunătățirea experienței
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedMarketing" 
                  checked={formData.hasAcceptedMarketing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedMarketing: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedMarketing" className="text-sm font-normal cursor-pointer">
                  Doresc să primesc comunicări marketing și newsletter
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedAttendanceTracking" 
                  checked={formData.hasAcceptedAttendanceTracking}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedAttendanceTracking: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedAttendanceTracking" className="text-sm font-normal cursor-pointer">
                  Accept urmărirea prezenței la consultații
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedPaymentTracking" 
                  checked={formData.hasAcceptedPaymentTracking}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedPaymentTracking: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedPaymentTracking" className="text-sm font-normal cursor-pointer">
                  Accept procesarea și stocarea informațiilor de plată
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedGroupPlacement" 
                  checked={formData.hasAcceptedGroupPlacement}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedGroupPlacement: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedGroupPlacement" className="text-sm font-normal cursor-pointer">
                  Accept plasarea în grupuri de studiu
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="hasAcceptedScheduleTracking" 
                  checked={formData.hasAcceptedScheduleTracking}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasAcceptedScheduleTracking: checked === true }))
                  }
                />
                <Label htmlFor="hasAcceptedScheduleTracking" className="text-sm font-normal cursor-pointer">
                  Accept gestionarea și notificările pentru program
                </Label>
              </div>
            </div>

            {/* Buton de înregistrare */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Se creează contul...
                  </div>
                ) : (
                  'Creează cont'
                )}
              </Button>
            </div>

            {/* Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ai deja cont?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Autentifică-te
                </Link>
              </p>
            </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
