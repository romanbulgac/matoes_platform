import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/Logo';
import {
  Users,
  Calendar,
  Star,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Expert Teachers',
      description: 'Qualified math teachers with years of experience',
      color: 'from-blue-100 to-blue-200',
    },
    {
      icon: Calendar,
      title: 'Flexible Schedule',
      description: 'Book consultations at your convenience',
      color: 'from-purple-100 to-purple-200',
    },
    {
      icon: Shield,
      title: 'GDPR Compliant',
      description: 'Your data is safe and protected',
      color: 'from-green-100 to-green-200',
    },
    {
      icon: Clock,
      title: 'Individual & Group',
      description: 'Choose between one-on-one or group sessions',
      color: 'from-orange-100 to-orange-200',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Popescu',
      role: 'Parent',
      avatar: 'MP',
      content: 'My daughter improved her math grade from 6 to 9 in just 3 months!',
      rating: 5,
    },
    {
      name: 'Ion Ionescu',
      role: 'Parent',
      avatar: 'II',
      content: 'Professional teachers and flexible scheduling. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Elena Dumitrescu',
      role: 'Parent',
      avatar: 'ED',
      content: 'The platform is easy to use and the teachers are amazing.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Active Students', value: '1,200+' },
    { label: 'Expert Teachers', value: '50+' },
    { label: 'Consultations', value: '10,000+' },
    { label: 'Success Rate', value: '95%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-purple-50/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/teachers" className="text-sm font-medium hover:text-primary transition-colors">
              Teachers
            </Link>
            <Link to="/preturi" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/aplicare-profesor" className="text-sm font-medium hover:text-primary transition-colors">
              Become a Teacher
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/inregistrare">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
          Premium Math Education Platform
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Excel in Math with
          <br />
          Expert Guidance
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with qualified math teachers for personalized consultations.
          Individual or group sessions tailored to your needs.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/inregistrare">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/teachers">
            <Button size="lg" variant="outline">
              Browse Teachers
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Mateos?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need for successful math learning
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all hover:shadow-lg"
            >
              <CardContent className="p-6 space-y-3">
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg w-fit`}>
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white/50 backdrop-blur-sm rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Simple steps to start learning</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Create Account', description: 'Sign up as a parent or student' },
            { step: '2', title: 'Choose Plan', description: 'Select a subscription that fits your needs' },
            { step: '3', title: 'Start Learning', description: 'Book consultations and improve your skills' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Parents Say</h2>
          <p className="text-lg text-muted-foreground">Success stories from our community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Excel in Math?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students improving their math skills
            </p>
            <Link to="/inregistrare">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Premium math education platform connecting students with expert teachers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/teachers" className="hover:text-primary">Teachers</Link></li>
                <li><Link to="/preturi" className="hover:text-primary">Pricing</Link></li>
                <li><Link to="/aplicare-profesor" className="hover:text-primary">Become a Teacher</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/data-processing-info" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/data-processing-info" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/data-processing-info" className="hover:text-primary">GDPR</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:contact@mateos.ro" className="hover:text-primary">Contact</a></li>
                <li><Link to="/urmarire-aplicatie" className="hover:text-primary">Track Application</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Mateos Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

