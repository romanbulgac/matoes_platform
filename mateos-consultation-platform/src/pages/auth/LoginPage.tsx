import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { GraduationCap, Eye, EyeOff, Github } from 'lucide-react';
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
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo & Brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GraduationCap className="size-4" />
            </div>
            Mateos
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FieldGroup>
                {/* Header */}
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Intră în contul tău</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Introdu email-ul și parola pentru a te conecta
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
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
                  />
                </Field>

                {/* Password Field */}
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Parolă</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
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
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </Field>

                {/* Submit Button */}
                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Se încarcă...
                      </>
                    ) : (
                      'Intră în cont'
                    )}
                  </Button>
                </Field>

                {/* Separator */}
                <FieldSeparator>Sau continuă cu</FieldSeparator>

                {/* Social Login */}
                <Field>
                  <Button variant="outline" type="button" disabled>
                    <Github className="mr-2 h-4 w-4" />
                    Intră cu GitHub
                  </Button>
                  <FieldDescription className="text-center">
                    Nu ai cont?{' '}
                    <Link
                      to="/inregistrare"
                      className="underline underline-offset-4 hover:text-primary"
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
              </FieldGroup>
            </form>
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

      {/* Right Side - Hero Image */}
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
          <div className="flex h-full flex-col items-center justify-center p-10 text-center">
            <div className="max-w-md space-y-6">
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-4">
                  Bine ai venit la Mateos
                </h2>
                <p className="text-muted-foreground text-lg">
                  Platforma educațională care conectează elevi cu cei mai buni profesori particulari
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Profesori</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-primary">2000+</div>
                  <div className="text-muted-foreground">Elevi</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-primary">4.8★</div>
                  <div className="text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
