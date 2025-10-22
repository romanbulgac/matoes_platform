import { Logo } from '@/components/Logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFadeIn } from '@/hooks/useGsap';
import { CalendarDays, Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function StudentRegistrationPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    educationLevel: '',
    mathLevel: '',
    phone: '',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const containerRef = useFadeIn<HTMLDivElement>([], { y: 10 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validări
    if (formData.password !== formData.confirmPassword) {
      setError('Parolele nu se potrivesc');
      return;
    }

    if (formData.password.length < 8) {
      setError('Parola trebuie să aibă cel puțin 8 caractere');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Trebuie să accepți termenii și condițiile');
      return;
    }

    setIsLoading(true);

    try {
      // Aici ar fi logica de înregistrare
      console.log('Înregistrare student:', formData);
      navigate('/login', { 
        state: { message: 'Cont creat cu succes! Te poți autentifica acum.' }
      });
  } catch {
      setError('A apărut o eroare la înregistrare. Te rugăm să încerci din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div ref={containerRef} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <Logo size="lg" variant="rounded" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Înregistrare Student
          </h1>
          <p className="text-gray-600">
            Alătură-te comunității Mateos și începe să înveți matematica cu cei mai buni profesori
          </p>
        </div>

        {/* Formular */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Eroare */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Informații personale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname" className="inline-flex items-center gap-2">
                  <UserRound className="w-4 h-4" /> Prenume
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  placeholder="Prenumele tău"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="lastname" className="inline-flex items-center gap-2">
                  <UserRound className="w-4 h-4" /> Nume
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  placeholder="Numele tău"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4" /> Adresa email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@exemplu.ro"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Telefon */}
            <div>
              <Label htmlFor="phone">Număr de telefon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+40 123 456 789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Data nașterii */}
            <div>
              <Label htmlFor="dateOfBirth" className="inline-flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Data nașterii
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Nivel educație */}
            <div>
              <Label htmlFor="educationLevel">Nivelul educației</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(v) => setFormData((p) => ({ ...p, educationLevel: v }))}
              >
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Selectează nivelul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gimnaziu">Gimnaziu (clasele V-VIII)</SelectItem>
                  <SelectItem value="liceu">Liceu (clasele IX-XII)</SelectItem>
                  <SelectItem value="facultate">Facultate</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="adult">Adult (educație continuă)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nivel matematică */}
            <div>
              <Label htmlFor="mathLevel">Nivelul cunoștințelor de matematică</Label>
              <Select
                value={formData.mathLevel}
                onValueChange={(v) => setFormData((p) => ({ ...p, mathLevel: v }))}
              >
                <SelectTrigger id="mathLevel">
                  <SelectValue placeholder="Selectează nivelul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incepator">Începător</SelectItem>
                  <SelectItem value="mediu">Mediu</SelectItem>
                  <SelectItem value="avansat">Avansat</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parolă */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="inline-flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Parola
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="pr-10"
                    placeholder="Minim 8 caractere"
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

              <div>
                <Label htmlFor="confirmPassword" className="inline-flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Confirmă parola
                </Label>
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
            </div>

            {/* Termeni și condiții */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, termsAccepted: Boolean(v) }))
                }
                className="mt-1"
                required
              />
              <Label htmlFor="termsAccepted" className="text-sm text-gray-600">
                Sunt de acord cu{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Termenii și Condițiile
                </a>{' '}
                și{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Politica de Confidențialitate
                </a>
              </Label>
            </div>

            {/* Buton înregistrare */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Se înregistrează...
                  </div>
                ) : (
                  'Creează cont'
                )}
              </Button>
            </div>

            {/* Link către login */}
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

        {/* Link-uri suplimentare */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p className="mb-2">Sau explorează:</p>
          <div className="space-x-4">
            <Link to="/" className="text-primary-600 hover:text-primary-500">
              Pagina principală
            </Link>
            <Link to="/aplicare-profesor" className="text-primary-600 hover:text-primary-500">
              Devino profesor
            </Link>
            <Link to="/preturi" className="text-primary-600 hover:text-primary-500">
              Vezi prețurile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
