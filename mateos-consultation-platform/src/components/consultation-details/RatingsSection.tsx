import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationDto } from '@/types/api';
import { Star } from 'lucide-react';
import { FC, useState } from 'react';

interface RatingsSectionProps {
  consultation: ConsultationDto;
}

interface Rating {
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
}

export const RatingsSection: FC<RatingsSectionProps> = ({ consultation }) => {
  const [ratings, setRatings] = useState<Rating[]>(
    consultation.participants.map(student => ({
      studentId: student.id,
      studentName: `${student.name} ${student.surname}`,
      rating: 0,
      comment: '',
    }))
  );

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateRating = (studentId: string, rating: number) => {
    setRatings(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, rating } : r))
    );
  };

  const updateComment = (studentId: string, comment: string) => {
    setRatings(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, comment } : r))
    );
  };

  const handleSaveRating = async (studentId: string) => {
    setIsSaving(true);
    try {
      const rating = ratings.find(r => r.studentId === studentId);
      // TODO: API call to save rating
      console.log('Saving rating:', rating);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (consultation.participants.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <Typography.H3 className="text-lg">Evaluări</Typography.H3>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {ratings.map(rating => (
            <div
              key={rating.studentId}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-amber-50 text-amber-700 text-xs">
                      {getInitials(rating.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <Typography.P className="font-medium text-sm">
                    {rating.studentName}
                  </Typography.P>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => updateRating(rating.studentId, star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-600">
                  {rating.rating > 0 ? `${rating.rating}/5` : 'Neevaluat'}
                </span>
              </div>

              {/* Comment Section */}
              {selectedStudent === rating.studentId ? (
                <div className="space-y-2">
                  <Textarea
                    value={rating.comment}
                    onChange={e => updateComment(rating.studentId, e.target.value)}
                    placeholder="Adaugă un comentariu despre performanța studentului..."
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStudent(null)}
                    >
                      Anulează
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveRating(rating.studentId)}
                      disabled={isSaving || rating.rating === 0}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      {isSaving ? 'Se salvează...' : 'Salvează'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {rating.comment ? (
                    <div className="mb-2">
                      <Typography.Small className="text-slate-600">
                        {rating.comment}
                      </Typography.Small>
                    </div>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedStudent(rating.studentId)}
                    className="text-xs h-8"
                  >
                    {rating.comment ? 'Editează' : 'Adaugă comentariu'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
