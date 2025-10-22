import { Award, BookOpenCheck, Brain, Calculator, CheckCircle, Target, GraduationCap, Users, TrendingUp, Star, Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HomePage() {
  const features = [
    {
      icon: Target,
      title: "Matching Inteligent",
      description: "Algoritmul nostru AI conectează studenții cu profesorii potriviți pe baza nivelului, preferințelor și obiectivelor."
    },
    {
      icon: BookOpenCheck,
      title: "Materiale Premium",
      description: "Bibliotecă vastă cu peste 10,000 de exerciții, exemple rezolvate și materiale video pentru toate nivelurile."
    },
    {
      icon: Calculator,
      title: "Whiteboard Virtual",
      description: "Rezolvați problemele împreună folosind tabla virtuală interactivă cu instrumente matematice avansate."
    },
    {
      icon: Brain,
      title: "Progres Tracking",
      description: "Urmărește-ți progresul cu grafice detaliate, rapoarte personalizate și recomandări inteligente."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left Side - Main Content */}
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

          {/* Main Content Container */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md space-y-8">
              {/* Hero Section */}
              <div className="space-y-4 text-center md:text-left">
                <div className="flex justify-center md:justify-start">
                  <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200 border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Platforma #1 de Matematică
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Învățare Matematică
                  <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    la Următorul Nivel
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Conectează-te cu cei mai buni profesori de matematică din România. 
                  Consultații personalizate, metode moderne și rezultate garantate.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link to="/inregistrare" className="block">
                  <Button size="lg" className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Începe Gratuit
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <Link to="/aplicare-profesor" className="block">
                  <Button size="lg" variant="outline" className="w-full h-12 border-2">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Devino Profesor
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center md:justify-start space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fără taxă de înscriere</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Primele 30 min gratuite</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Rezultate în 2-3 sesiuni</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-muted-foreground pt-4">
                <Link to="/preturi" className="hover:text-primary underline-offset-4 hover:underline">
                  Vezi prețurile
                </Link>
                <span>·</span>
                <Link to="/login" className="hover:text-primary underline-offset-4 hover:underline">
                  Ai deja cont?
                </Link>
              </div>

              {/* Premium Features Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 hover:shadow-md">
                      <CardContent className="p-4 space-y-2">
                        <div className="p-2 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg w-fit">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900">{feature.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
                    Bine ai venit la Mateos
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Platforma educațională premium care conectează elevi cu cei mai buni profesori de matematică din România
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

                {/* Features List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">De ce Mateos?</h3>
                  
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Matching Inteligent AI</h4>
                      <p className="text-xs text-gray-600">Conectare automată cu profesorul potrivit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Profesori Verificați</h4>
                      <p className="text-xs text-gray-600">Toți profesorii sunt certificați și verificați</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Rezultate Rapide</h4>
                      <p className="text-xs text-gray-600">Progres vizibil în 2-3 sesiuni</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Satisfacție Garantată</h4>
                      <p className="text-xs text-gray-600">Rambursare în 14 zile dacă nu ești mulțumit</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      AP
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-sm text-gray-900">Ana-Maria Popescu</h4>
                      <p className="text-xs text-gray-600">Elevă clasa a 11-a</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "Datorită platformei Mateos am reușit să îmi îmbunătățesc nota la matematică cu 2 puncte în doar o lună!"
                  </p>
                </div>

                {/* Bottom Stats */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>2000+ consultații</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>95% succes</span>
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
