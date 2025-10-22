import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, CheckCircle, Users, TrendingUp, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <Badge className="mb-2 bg-gradient-to-r from-primary to-purple-600 text-white">
                Welcome Back
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Sign in to Mateos</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Access your dashboard and start learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link to="/inregistrare" className="text-primary font-semibold hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <Link to="/aplicare-profesor" className="hover:text-primary">
                Are you a teacher? Apply here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 p-10">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Join the Future of Math Education
            </h2>
            <p className="text-lg text-gray-700">
              Access expert teachers, flexible scheduling, and personalized learning experiences.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: CheckCircle,
                title: '1,200+ Active Students',
                description: 'Growing community of learners',
              },
              {
                icon: Users,
                title: '50+ Expert Teachers',
                description: 'Qualified professionals ready to help',
              },
              {
                icon: TrendingUp,
                title: '95% Success Rate',
                description: 'Students improving their grades',
              },
              {
                icon: Shield,
                title: 'GDPR Compliant',
                description: 'Your data is safe and protected',
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-sm italic text-gray-700 mb-3">
                "My son's math grade improved from 6 to 9 in just one semester. The teachers are amazing!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                  MP
                </div>
                <div>
                  <div className="font-semibold text-sm">Maria Popescu</div>
                  <div className="text-xs text-gray-600">Parent, Bucharest</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

