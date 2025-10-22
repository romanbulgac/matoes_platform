import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Search, Star, GraduationCap, Clock, Award } from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const teachers = [
    {
      id: '1',
      name: 'Maria Popescu',
      avatar: 'MP',
      specializations: ['Algebra', 'Calculus', 'Geometry'],
      rating: 4.9,
      totalConsultations: 250,
      yearsOfExperience: 10,
      hourlyRate: 50,
      education: 'PhD Mathematics, University of Bucharest',
    },
    {
      id: '2',
      name: 'Ion Ionescu',
      avatar: 'II',
      specializations: ['Trigonometry', 'Statistics', 'Algebra'],
      rating: 4.8,
      totalConsultations: 180,
      yearsOfExperience: 8,
      hourlyRate: 45,
      education: 'MSc Mathematics, Babeș-Bolyai University',
    },
    {
      id: '3',
      name: 'Elena Dumitrescu',
      avatar: 'ED',
      specializations: ['Calculus', 'Linear Algebra', 'Analysis'],
      rating: 5.0,
      totalConsultations: 320,
      yearsOfExperience: 12,
      hourlyRate: 60,
      education: 'PhD Applied Mathematics, Polytechnic University',
    },
    {
      id: '4',
      name: 'Andrei Georgescu',
      avatar: 'AG',
      specializations: ['Geometry', 'Trigonometry', 'Algebra'],
      rating: 4.7,
      totalConsultations: 150,
      yearsOfExperience: 6,
      hourlyRate: 40,
      education: 'MSc Mathematics Education',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-purple-50/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/inregistrare">
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
          50+ Expert Teachers
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect
          <br />
          Math Teacher
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse our qualified teachers and book your first consultation
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, subject, or specialization..."
            className="pl-12 h-14 text-lg bg-white shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="border-0 bg-white/50 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-lg font-bold">
                      {teacher.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{teacher.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({teacher.totalConsultations} sessions)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2">
                  {teacher.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{teacher.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>{teacher.yearsOfExperience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{teacher.hourlyRate} RON/hour</span>
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  View Profile & Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA for Teachers */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Are You a Math Teacher?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our platform and start teaching students from across Romania
            </p>
            <Link to="/aplicare-profesor">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Apply to Teach
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

