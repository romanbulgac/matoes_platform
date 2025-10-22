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
import { UserRole } from '@/types';
import { Mail, Lock, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: UserRole.PARENT,
    phoneNumber: '',
    dateOfBirth: '',
    gdprConsent: false,
    termsConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.gdprConsent || !formData.termsConsent) {
      setError('You must accept the terms and privacy policy');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Registration Form */}
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
                Join Mateos
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <p className="text-muted-foreground">
                Start your journey to math excellence
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Fill in your details to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            required
                            className="pl-10"
                          />
                        </div>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <FieldContent>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          required
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <FieldContent>
                      <select
                        id="role"
                        className="w-full px-3 py-2 border rounded-md"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value as UserRole)}
                      >
                        <option value={UserRole.PARENT}>Parent</option>
                        <option value={UserRole.STUDENT}>Student</option>
                      </select>
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
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <div className="space-y-2">
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termsConsent}
                        onChange={(e) => handleChange('termsConsent', e.target.checked)}
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>
                        I accept the{' '}
                        <Link to="/data-processing-info" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gdprConsent}
                        onChange={(e) => handleChange('gdprConsent', e.target.checked)}
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>
                        I consent to{' '}
                        <Link to="/data-processing-info" className="text-primary hover:underline">
                          data processing
                        </Link>{' '}
                        (GDPR)
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Sign in
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
              Start Your Learning Journey Today
            </h2>
            <p className="text-lg text-gray-700">
              Join thousands of students and parents who trust Mateos for quality math education.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Students', value: '1,200+' },
              { label: 'Expert Teachers', value: '50+' },
              { label: 'Consultations', value: '10,000+' },
              { label: 'Success Rate', value: '95%' },
            ].map((stat, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What you'll get:</h3>
            <ul className="space-y-2">
              {[
                'Access to 50+ qualified math teachers',
                'Flexible scheduling for your convenience',
                'Individual or group consultation options',
                'Progress tracking and detailed reports',
                'GDPR-compliant data protection',
                'Cancel or pause anytime',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

