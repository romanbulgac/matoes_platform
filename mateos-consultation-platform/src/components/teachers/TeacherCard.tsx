import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, BookOpen, Calendar, Award, Heart, Share2, Eye, MapPin, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeacherWithStats } from '@/services/teacherService';

interface TeacherCardProps {
  teacher: TeacherWithStats;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export const TeacherCard: FC<TeacherCardProps> = ({ teacher, className, viewMode = 'grid' }) => {
  const initials = `${teacher.name?.charAt(0) || ''}${teacher.surname?.charAt(0) || ''}`.toUpperCase();
  const fullName = `${teacher.name} ${teacher.surname}`;
  
  // Premium rating stars with animation
  const renderRating = () => {
    if (!teacher.AverageRating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-4 h-4 transition-colors",
                i < Math.floor(teacher.AverageRating!) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              )} 
            />
          ))}
        </div>
        <span className="font-semibold text-sm text-gray-900">{teacher.AverageRating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">
          ({teacher.TotalReviews || 0} recenzii)
        </span>
      </div>
    );
  };

  // Premium price display
  const renderPrice = () => {
    const price = teacher.HourlyRate || 0;
    return (
      <div className="flex items-center gap-1">
        <Zap className="w-4 h-4 text-green-500" />
        <span className="font-bold text-lg text-green-600">{price} RON</span>
        <span className="text-sm text-muted-foreground">/oră</span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Card className={cn(
        "group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-r from-white to-gray-50",
        className
      )}>
        <div className="flex items-center gap-6 p-6">
          {/* Avatar */}
          <Avatar className="w-20 h-20 border-4 border-primary-200 group-hover:border-primary-400 transition-colors">
            <AvatarImage src={teacher.profilePicture} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {fullName}
                </h3>
                <p className="text-primary-600 font-medium">{teacher.Subject || 'Matematică'}</p>
                {renderRating()}
              </div>
              <div className="text-right">
                {renderPrice()}
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Favorite
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            {teacher.Bio && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {teacher.Bio}
              </p>
            )}
            
            {/* Specializations */}
            {teacher.Specializations && teacher.Specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {teacher.Specializations.slice(0, 4).map((spec, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-primary-100 text-primary-700"
                  >
                    {spec}
                  </Badge>
                ))}
                {teacher.Specializations.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.Specializations.length - 4}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {teacher.YearsOfExperience && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-500" />
                  <span>{teacher.YearsOfExperience} ani experiență</span>
                </div>
              )}
              {teacher.Department && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  <span className="truncate">{teacher.Department}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Online</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button asChild size="sm" className="gap-2">
              <Link to={`/teachers/${teacher.id}`}>
                <Eye className="w-4 h-4" />
                Vezi Profil
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to={`/teachers/${teacher.id}/book`}>
                <Calendar className="w-4 h-4" />
                Rezervă
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:from-primary-50 hover:to-white",
      className
    )}>
      <CardHeader className="pb-3 relative">
        {/* Premium badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
        
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-4 border-primary-200 group-hover:border-primary-400 transition-colors">
            <AvatarImage src={teacher.profilePicture} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
              {fullName}
            </CardTitle>
            <CardDescription className="mt-1 text-primary-600 font-medium">
              {teacher.Subject || 'Matematică'}
            </CardDescription>
            {renderRating()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          {renderPrice()}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-500" />
            </Button>
          </div>
        </div>

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
                className="text-xs bg-primary-100 text-primary-700"
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
              <span>{teacher.YearsOfExperience} ani</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>Online</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex gap-2">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-2"
        >
          <Link to={`/teachers/${teacher.id}`}>
            <Eye className="w-4 h-4" />
            Vezi Profil
          </Link>
        </Button>
        <Button 
          asChild 
          size="sm" 
          className="flex-1 gap-2 bg-primary-600 hover:bg-primary-700"
        >
          <Link to={`/teachers/${teacher.id}/book`}>
            <Calendar className="w-4 h-4" />
            Rezervă
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
