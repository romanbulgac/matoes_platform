import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  Target, 
  Award,
  Calendar,
  CreditCard,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap
} from 'lucide-react';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  progress?: number;
  badge?: string;
  trend?: number[];
}

interface StatsCarouselProps {
  userRole: 'Parent' | 'Teacher' | 'Admin' | 'Student' | 'Administrator';
  className?: string;
}

export function StatsCarousel({ userRole, className }: StatsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getStatsForRole = (): StatCard[] => {
    switch (userRole) {
      case 'Parent':
        return [
          {
            id: 'children-progress',
            title: 'Progresul Copiilor',
            value: '87%',
            change: 12,
            changeType: 'increase',
            icon: TrendingUp,
            description: 'Progres mediu în toate materiile',
            color: 'text-green-600',
            progress: 87,
            badge: 'Excelent'
          },
          {
            id: 'lessons-completed',
            title: 'Lecții Finalizate',
            value: '24',
            change: 3,
            changeType: 'increase',
            icon: CheckCircle,
            description: 'Lecții completate această lună',
            color: 'text-blue-600',
            progress: 80
          },
          {
            id: 'upcoming-lessons',
            title: 'Lecții Programate',
            value: '8',
            change: 0,
            changeType: 'neutral',
            icon: Calendar,
            description: 'Lecții în următoarele 2 săptămâni',
            color: 'text-purple-600',
            badge: 'Această săptămână'
          },
          {
            id: 'package-usage',
            title: 'Pachet Activ',
            value: '15/20',
            change: -2,
            changeType: 'decrease',
            icon: CreditCard,
            description: 'Lecții rămase din pachetul curent',
            color: 'text-orange-600',
            progress: 75
          },
          {
            id: 'teacher-ratings',
            title: 'Rating Profesori',
            value: '4.8',
            change: 0.2,
            changeType: 'increase',
            icon: Star,
            description: 'Rating mediu al profesorilor',
            color: 'text-yellow-600',
            progress: 96
          }
        ];

      case 'Teacher':
        return [
          {
            id: 'total-students',
            title: 'Elevi Activi',
            value: '32',
            change: 5,
            changeType: 'increase',
            icon: Users,
            description: 'Elevi în grupurile tale',
            color: 'text-blue-600',
            progress: 85,
            badge: 'Crescere'
          },
          {
            id: 'lessons-taught',
            title: 'Lecții Predate',
            value: '156',
            change: 18,
            changeType: 'increase',
            icon: BookOpen,
            description: 'Lecții predate această lună',
            color: 'text-green-600',
            progress: 92
          },
          {
            id: 'average-rating',
            title: 'Rating Mediu',
            value: '4.9',
            change: 0.1,
            changeType: 'increase',
            icon: Star,
            description: 'Rating mediu de la elevi',
            color: 'text-yellow-600',
            progress: 98,
            badge: 'Top Rated'
          },
          {
            id: 'earnings',
            title: 'Câștiguri Lunare',
            value: '2,450 RON',
            change: 320,
            changeType: 'increase',
            icon: CreditCard,
            description: 'Câștiguri din lecții',
            color: 'text-emerald-600',
            progress: 88
          },
          {
            id: 'availability',
            title: 'Disponibilitate',
            value: '85%',
            change: 5,
            changeType: 'increase',
            icon: Clock,
            description: 'Sloturi ocupate din total',
            color: 'text-purple-600',
            progress: 85
          }
        ];

      case 'Admin':
      case 'Administrator':
        return [
          {
            id: 'total-users',
            title: 'Utilizatori Total',
            value: '1,247',
            change: 89,
            changeType: 'increase',
            icon: Users,
            description: 'Utilizatori înregistrați',
            color: 'text-blue-600',
            progress: 78,
            badge: 'Crescere'
          },
          {
            id: 'active-teachers',
            title: 'Profesori Activi',
            value: '156',
            change: 12,
            changeType: 'increase',
            icon: GraduationCap,
            description: 'Profesori activi pe platformă',
            color: 'text-green-600',
            progress: 82
          },
          {
            id: 'monthly-revenue',
            title: 'Venit Lunar',
            value: '45,230 RON',
            change: 12.5,
            changeType: 'increase',
            icon: TrendingUp,
            description: 'Venituri din comisioane',
            color: 'text-emerald-600',
            progress: 95,
            badge: 'Record'
          },
          {
            id: 'pending-applications',
            title: 'Cereri în Așteptare',
            value: '23',
            change: -8,
            changeType: 'decrease',
            icon: AlertCircle,
            description: 'Cereri profesori de procesat',
            color: 'text-orange-600',
            progress: 60
          },
          {
            id: 'platform-health',
            title: 'Sănătate Platformă',
            value: '99.8%',
            change: 0.1,
            changeType: 'increase',
            icon: Zap,
            description: 'Uptime și performanță',
            color: 'text-green-600',
            progress: 99.8,
            badge: 'Excelent'
          }
        ];

      case 'Student':
        return [
          {
            id: 'my-progress',
            title: 'Progresul Meu',
            value: '78%',
            change: 15,
            changeType: 'increase',
            icon: Target,
            description: 'Progres în materiile mele',
            color: 'text-blue-600',
            progress: 78,
            badge: 'În creștere'
          },
          {
            id: 'lessons-attended',
            title: 'Lecții Participat',
            value: '18',
            change: 4,
            changeType: 'increase',
            icon: CheckCircle,
            description: 'Lecții participat această lună',
            color: 'text-green-600',
            progress: 90
          },
          {
            id: 'homework-completed',
            title: 'Teme Finalizate',
            value: '24',
            change: 6,
            changeType: 'increase',
            icon: BookOpen,
            description: 'Teme completate',
            color: 'text-purple-600',
            progress: 85
          },
          {
            id: 'achievements',
            title: 'Realizări',
            value: '12',
            change: 2,
            changeType: 'increase',
            icon: Award,
            description: 'Badge-uri câștigate',
            color: 'text-yellow-600',
            progress: 80,
            badge: 'Nou!'
          },
          {
            id: 'next-lesson',
            title: 'Următoarea Lecție',
            value: 'În 2 ore',
            change: 0,
            changeType: 'neutral',
            icon: Clock,
            description: 'Matematică cu Prof. Popescu',
            color: 'text-orange-600',
            badge: 'Astăzi'
          }
        ];

      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <ArrowDownRight className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <CarouselItem key={stat.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                          {stat.badge && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {stat.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {stat.change !== undefined && stat.change !== 0 && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(stat.changeType!)}`}>
                          {getChangeIcon(stat.changeType!)}
                          <span>{Math.abs(stat.change)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-600">
                        {stat.description}
                      </p>
                    </div>

                    {stat.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progres</span>
                          <span>{stat.progress}%</span>
                        </div>
                        <Progress value={stat.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      <div className="flex justify-center mt-4 gap-2">
        {stats.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}