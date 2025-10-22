import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Github, 
  Sparkles, 
  Shield, 
  Zap, 
  Users, 
  BookOpen,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                    <Shield className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Bun venit înapoi!
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Conectează-te pentru a accesa platforma ta educațională
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Adresa de email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nume@exemplu.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                  />
                  <FieldDescription className="text-xs text-muted-foreground">
                    Introdu adresa ta de email pentru autentificare
                  </FieldDescription>
                </Field>

                {/* Password Field */}
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Parola
                    </FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline font-medium"
                    >
                      Ai uitat parola?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12 pr-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
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
                    Parola trebuie să conțină cel puțin 8 caractere
                  </FieldDescription>
                </Field>

                {/* Submit Button */}
                <Field>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Se conectează...
                      </>
                    ) : (
                      <>
                        Conectează-te
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </Field>

                {/* Separator */}
                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-xs text-muted-foreground">
                      sau continuă cu
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <Field>
                  <Button 
                    variant="outline" 
                    type="button" 
                    disabled
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub (în curând)
                  </Button>
                  <FieldDescription className="text-center text-sm">
                    Nu ai cont?{' '}
                    <Link
                      to="/inregistrare"
                      className="text-primary-600 hover:text-primary-700 underline underline-offset-4 font-medium"
                    >
                      Înregistrează-te
                    </Link>
                  </FieldDescription>
                </Field>

                {/* Demo Accounts */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    🎯 Conturi Demo pentru Test
                  </h3>
                  <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Student:</p>
                        <p className="text-blue-600 dark:text-blue-400">student@demo.ro</p>
                      </div>
                      <div>
                        <p className="font-medium">Profesor:</p>
                        <p className="text-blue-600 dark:text-blue-400">teacher@demo.ro</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                      <p>
                        <span className="font-medium">Parola pentru toate:</span>{' '}
                        <span className="text-blue-600 dark:text-blue-400">demo123</span>
                      </p>
                    </div>
                  </div>
                 </div>
             </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Sau mergi la:</p>
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

      {/* Right Side - Premium Carousel */}
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
                  Bine ai venit la Mateos
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Platforma educațională premium care conectează elevi cu cei mai buni profesori particulari din România
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Profesori</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">2000+</div>
                  <div className="text-sm text-gray-600 font-medium">Elevi</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary-600 mb-1">4.8★</div>
                  <div className="text-sm text-gray-600 font-medium">Rating</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Lecții personalizate</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Profesori verificați</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Suport 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
