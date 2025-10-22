import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  Star
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex flex-col gap-6 p-6 md:p-10">
          {/* Logo & Brand */}
          <div className="flex justify-center gap-2 md:justify-start">
            <Link to="/" className="flex items-center gap-2 font-medium">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white flex size-8 items-center justify-center rounded-lg shadow-lg">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Mateos
              </span>
            </Link>
            <Badge variant="secondary" className="ml-auto gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          </div>

          {/* Form Container */}
          <div className="flex flex-1 items-center justify-center">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Creează cont nou
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Alătură-te platformei Mateos și începe să înveți
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Prenume și Nume */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstname" className="text-sm font-semibold text-gray-700">
                        Prenume
                      </FieldLabel>
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        placeholder="Ion"
                        value={formData.firstname}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 border-gray-200 focus:border-primary-500"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastname" className="text-sm font-semibold text-gray-700">
                        Nume
                      </FieldLabel>
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                        placeholder="Popescu"
                        value={formData.lastname}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 border-gray-200 focus:border-primary-500"
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Adresa de email
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="email@exemplu.ro"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-primary-500"
                    />
                  </Field>

                  {/* Rol */}
                  <Field>
                    <FieldLabel htmlFor="role" className="text-sm font-semibold text-gray-700">
                      Sunt
                    </FieldLabel>
                    <Select
                      value={formData.role}
                      onValueChange={(v) => setFormData((p) => ({ ...p, role: v as UserRole }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="role" className="h-11">
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
                  </Field>

                  {/* Parola */}
                  <Field>
                    <FieldLabel htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Parola
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 6 caractere"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 pr-10 border-gray-200 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    <FieldDescription className="text-xs text-muted-foreground">
                      Minimum 6 caractere
                    </FieldDescription>
                  </Field>

                  {/* Confirmarea parolei */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                      Confirmă parola
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Repetă parola"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 pr-10 border-gray-200 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </Field>

                  {/* Telefon (opțional) */}
                  <Field>
                    <FieldLabel htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                      Număr de telefon (opțional)
                    </FieldLabel>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+40 XXX XXX XXX"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-primary-500"
                    />
                  </Field>

                  {/* Acord cu termenii - OBLIGATORIU */}
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Acorduri necesare <span className="text-red-500">*</span></p>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedPrivacyPolicy" 
                        checked={formData.hasAcceptedPrivacyPolicy}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedPrivacyPolicy: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedPrivacyPolicy" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept{' '}
                        <a href="/privacy" target="_blank" className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-4">
                          Politica de Confidențialitate
                        </a>
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedTerms" 
                        checked={formData.hasAcceptedTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedTerms: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedTerms" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept{' '}
                        <a href="/terms" target="_blank" className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-4">
                          Termenii și Condițiile
                        </a>
                      </FieldLabel>
                    </div>
                  </div>

                  {/* Acorduri opționale */}
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Acorduri opționale</p>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedCookies" 
                        checked={formData.hasAcceptedCookies}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedCookies: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedCookies" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept utilizarea cookie-urilor pentru îmbunătățirea experienței
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedMarketing" 
                        checked={formData.hasAcceptedMarketing}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedMarketing: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedMarketing" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Doresc să primesc comunicări marketing și newsletter
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedAttendanceTracking" 
                        checked={formData.hasAcceptedAttendanceTracking}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedAttendanceTracking: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedAttendanceTracking" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept urmărirea prezenței la consultații
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedPaymentTracking" 
                        checked={formData.hasAcceptedPaymentTracking}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedPaymentTracking: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedPaymentTracking" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept procesarea și stocarea informațiilor de plată
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedGroupPlacement" 
                        checked={formData.hasAcceptedGroupPlacement}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedGroupPlacement: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedGroupPlacement" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept plasarea în grupuri de studiu
                      </FieldLabel>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="hasAcceptedScheduleTracking" 
                        checked={formData.hasAcceptedScheduleTracking}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, hasAcceptedScheduleTracking: checked === true }))
                        }
                        disabled={isLoading}
                      />
                      <FieldLabel htmlFor="hasAcceptedScheduleTracking" className="text-sm font-normal cursor-pointer leading-relaxed">
                        Accept gestionarea și notificările pentru program
                      </FieldLabel>
                    </div>
                  </div>

                  {/* Buton de înregistrare */}
                  <Field>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Se creează contul...
                        </>
                      ) : (
                        <>
                          Creează cont
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Field>

                  {/* Login Link */}
                  <div className="text-center text-sm">
                    Ai deja cont?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary-600 hover:text-primary-700 underline underline-offset-4 font-medium"
                    >
                      Autentifică-te
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Footer Links */}
          <div className="text-center text-sm text-muted-foreground">
            <div className="space-x-4">
              <Link to="/" className="hover:text-primary underline-offset-4 hover:underline">
                Pagina principală
              </Link>
              <Link to="/aplicare-profesor" className="hover:text-primary underline-offset-4 hover:underline">
                Devino profesor
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Premium Branding */}
        <div className="bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
            <div className="flex h-full flex-col items-center justify-center p-10 text-center">
              <div className="max-w-lg space-y-8">
                {/* Hero Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Alătură-te platformei Mateos
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Începe călătoria ta educațională cu cei mai buni profesori de matematică din România
                  </p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600 font-medium">Studenți</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <GraduationCap className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600 font-medium">Profesori</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Star className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary-600 mb-1">4.9★</div>
                    <div className="text-sm text-gray-600 font-medium">Rating</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Beneficii pentru membri</h3>
                  
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-sm text-gray-700">Acces la profesori verificați și certificați</span>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-sm text-gray-700">Sesiuni personalizate după nevoile tale</span>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-sm text-gray-700">Materiale educaționale premium</span>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-sm text-gray-700">Urmărire progres în timp real</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">100% Securizat</p>
                      <p className="text-sm text-gray-600">Datele tale sunt protejate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
