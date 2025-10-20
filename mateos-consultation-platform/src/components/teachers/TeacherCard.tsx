import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, BookOpen, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeacherWithStats } from '@/services/teacherService';

interface TeacherCardProps {
  teacher: TeacherWithStats;
  className?: string;
}

export const TeacherCard: FC<TeacherCardProps> = ({ teacher, className }) => {
  const initials = `${teacher.name?.charAt(0) || ''}${teacher.surname?.charAt(0) || ''}`.toUpperCase();
  const fullName = `${teacher.name} ${teacher.surname}`;
  
  // Рендер звездочек рейтинга
  const renderRating = () => {
    if (!teacher.AverageRating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-sm">{teacher.AverageRating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">
          ({teacher.TotalReviews || 0} recenzii)
        </span>
      </div>
    );
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-300",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary-200">
            <AvatarImage src={teacher.profilePicture} alt={fullName} />
            <AvatarFallback className="bg-primary-100 text-primary-700 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
              {fullName}
            </CardTitle>
            <CardDescription className="mt-1">
              {teacher.Subject || 'Matematică'}
            </CardDescription>
            {renderRating()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bio/Description */}
        {teacher.Bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {teacher.Bio}
          </p>
        )}

        {/* Specializations */}
        {teacher.Specializations && teacher.Specializations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {teacher.Specializations.slice(0, 3).map((spec, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
              >
                {spec}
              </Badge>
            ))}
            {teacher.Specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.Specializations.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {teacher.YearsOfExperience && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-primary-500" />
              <span>{teacher.YearsOfExperience} ani experiență</span>
            </div>
          )}
          {teacher.Department && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span className="truncate">{teacher.Department}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex gap-2">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="flex-1"
        >
          <Link to={`/teachers/${teacher.id}`}>
            <Calendar className="w-4 h-4 mr-2" />
            Vezi Profil
          </Link>
        </Button>
        <Button 
          asChild 
          size="sm" 
          className="flex-1"
        >
          <Link to={`/teachers/${teacher.id}/book`}>
            Rezervă
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
