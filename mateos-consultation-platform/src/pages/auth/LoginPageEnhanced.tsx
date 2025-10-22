import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { GraduationCap, Eye, EyeOff, Github, Star, Quote } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const testimonials = [
  {
    name: 'Maria Ionescu',
    role: 'Studentă, Liceu',
    rating: 5,
    text: 'Mateos m-a ajutat să găsesc profesorul perfect pentru matematică. Notele mele s-au îmbunătățit enorm!',
    image: '👩‍🎓',
  },
  {
    name: 'Alexandru Popa',
    role: 'Student, Universitate',
    rating: 5,
    text: 'Platformă excelentă! Profesorii sunt foarte profesioniști și meditațiile sunt interactive.',
    image: '👨‍🎓',
  },
  {
    name: 'Prof. Elena Marinescu',
    role: 'Profesor Matematică',
    rating: 5,
    text: 'Ca profesor, Mateos îmi oferă toate instrumentele necesare pentru a-mi gestiona lecțiile eficient.',
    image: '👩‍🏫',
  },
];

export function LoginPageEnhanced() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = await login(email, password, false);
      
      if (session?.isNewDevice) {
        errorHandler.showInfo(
          'Am detectat un dispozitiv nou. Dacă nu ai fost tu, contactează suportul.',
          'Dispozitiv nou detectat'
        );
      }
      
      errorHandler.showSuccess('Te-ai conectat cu succes!', 'Bun venit');
      navigate('/dashboard');
    } catch (error) {
      const errorDetails = errorHandler.handleAuthError(error, {
        showToast: true,
        duration: 7000
      });
      
      setError(errorDetails.message);
      errorHandler.showError(
        errorDetails.message || 'Eroare la autentificare',
        'Eroare'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo & Brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white flex size-8 items-center justify-center rounded-lg shadow-md">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Mateos
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Bine ai revenit! 👋
                </h1>
                <p className="text-muted-foreground text-balance">
                  Conectează-te pentru a continua învățarea
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-in fade-in-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplu.ro"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="transition-all focus:ring-2 focus:ring-primary-500"
                />
              </Field>

              {/* Password Field */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Parolă</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline transition-colors"
                  >
                    Ai uitat parola?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </Field>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Se încarcă...
                  </>
                ) : (
                  'Intră în cont'
                )}
              </Button>

              {/* Separator */}
              <FieldSeparator>Sau continuă cu</FieldSeparator>

              {/* Social Login */}
              <Button variant="outline" type="button" disabled className="transition-all hover:bg-gray-50">
                <Github className="mr-2 h-4 w-4" />
                Intră cu GitHub
              </Button>

              <FieldDescription className="text-center">
                Nu ai cont?{' '}
                <Link
                  to="/inregistrare"
                  className="font-medium text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline transition-colors"
                >
                  Înregistrează-te acum
                </Link>
              </FieldDescription>

              {/* Demo Accounts */}
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
                    🎯 Conturi Demo pentru Test
                  </h3>
                  <div className="space-y-2 text-xs text-primary-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 rounded p-2">
                        <p className="font-medium">Student:</p>
                        <p className="text-primary-600 font-mono">student@demo.ro</p>
                      </div>
                      <div className="bg-white/50 rounded p-2">
                        <p className="font-medium">Profesor:</p>
                        <p className="text-primary-600 font-mono">teacher@demo.ro</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="bg-white/50 rounded p-2 text-center">
                      <span className="font-medium">Parola pentru toate:</span>{' '}
                      <span className="text-primary-600 font-mono font-bold">demo123</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="space-x-4">
            <Link to="/" className="hover:text-primary-600 underline-offset-4 hover:underline transition-colors">
              Acasă
            </Link>
            <Link to="/aplicare-profesor" className="hover:text-primary-600 underline-offset-4 hover:underline transition-colors">
              Devino profesor
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Hero */}
      <div className="bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          <div className="flex h-full flex-col items-center justify-center p-10">
            <div className="max-w-lg space-y-8">
              {/* Main Hero Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Educație Premium
                </h2>
                <p className="text-center text-gray-600 text-lg leading-relaxed">
                  Alătură-te platformei care transformă educația. Conectează-te cu cei mai buni profesori și descoperă puterea învățării personalizate.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '500+', label: 'Profesori' },
                  { value: '2000+', label: 'Elevi' },
                  { value: '4.8★', label: 'Rating' },
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform"
                  >
                    <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonials Carousel */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary-500" />
                  Ce spun utilizatorii noștri
                </h3>
                
                <Carousel
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem key={index}>
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{testimonial.image}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <p className="text-sm text-gray-700 italic mb-3">
                                "{testimonial.text}"
                              </p>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {testimonial.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {testimonial.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

