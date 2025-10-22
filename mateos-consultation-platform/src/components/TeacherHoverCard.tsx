import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  MapPin, 
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  Zap,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  Languages
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  surname: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  subjects: string[];
  experience: number;
  price: number;
  currency: string;
  location: string;
  languages: string[];
  availability: 'high' | 'medium' | 'low';
  responseTime: string;
  completionRate: number;
  isVerified: boolean;
  isTopRated: boolean;
  specialties: string[];
  education: string[];
  certifications: string[];
  description: string;
  nextAvailableSlot?: string;
  totalStudents: number;
  successRate: number;
}

interface TeacherHoverCardProps {
  teacher: Teacher;
  children: React.ReactNode;
}

export function TeacherHoverCard({ teacher, children }: TeacherHoverCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'high':
        return 'Disponibilitate mare';
      case 'medium':
        return 'Disponibilitate moderată';
      case 'low':
        return 'Disponibilitate limitată';
      default:
        return 'Disponibilitate necunoscută';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" side="right" align="start">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarImage src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {teacher.name.charAt(0)}{teacher.surname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {teacher.name} {teacher.surname}
                    </h3>
                    {teacher.isVerified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificat
                      </Badge>
                    )}
                    {teacher.isTopRated && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{teacher.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{teacher.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(teacher.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {teacher.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({teacher.reviewCount} recenzii)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Price and Availability */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {teacher.price} {teacher.currency}/lecție
                  </div>
                  <div className="text-sm text-gray-600">
                    {teacher.experience} ani experiență
                  </div>
                </div>
                <Badge className={getAvailabilityColor(teacher.availability)}>
                  {getAvailabilityText(teacher.availability)}
                </Badge>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Materii predate
                </h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.slice(0, 4).map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {teacher.subjects.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.subjects.length - 4} mai multe
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{teacher.totalStudents}</div>
                  <div className="text-xs text-gray-600">Elevi totali</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{teacher.successRate}%</div>
                  <div className="text-xs text-gray-600">Rată de succes</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Rată de finalizare</span>
                  <span className="font-medium">{teacher.completionRate}%</span>
                </div>
                <Progress value={teacher.completionRate} className="h-2" />
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Limbi vorbite
                </h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.languages.map((language) => (
                    <Badge key={language} variant="secondary" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Next Available Slot */}
              {teacher.nextAvailableSlot && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Următorul slot disponibil:</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {teacher.nextAvailableSlot}
                  </div>
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactează
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programează
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
}
