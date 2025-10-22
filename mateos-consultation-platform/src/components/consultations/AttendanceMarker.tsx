/**
 * AttendanceMarker - Component pentru marcarea prezenței elevilor
 * 
 * Funcționalitate:
 * - Marcare prezență simplă pentru profesori
 * - Status: Present, Absent, Late
 * - Note despre lecție
 * - Salvare în backend
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Clock, Save, XCircle } from 'lucide-react';
import { FC, useState } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  attendance?: 'Present' | 'Absent' | 'Late';
}

interface AttendanceMarkerProps {
  consultationId: string;
  consultationTitle: string;
  scheduledAt: string;
  students: Student[];
  onAttendanceSaved?: () => void;
}

export const AttendanceMarker: FC<AttendanceMarkerProps> = ({
  consultationId,
  consultationTitle,
  scheduledAt,
  students,
  onAttendanceSaved
}) => {
  const { toast } = useToast();
  
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [lessonNotes, setLessonNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would call the actual attendance service
      // await AttendanceService.markAttendance(consultationId, attendance, lessonNotes);
      
      toast({
        title: 'Succes',
        description: 'Prezența a fost salvată cu succes',
      });

      onAttendanceSaved?.();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut salva prezența. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceIcon = (status: 'Present' | 'Absent' | 'Late' | undefined) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAttendanceButtonVariant = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    const currentStatus = attendance[studentId];
    if (currentStatus === status) {
      switch (status) {
        case 'Present':
          return 'default';
        case 'Absent':
          return 'destructive';
        case 'Late':
          return 'secondary';
      }
    }
    return 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const allStudentsMarked = students.every(student => attendance[student.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Marcare Prezență
        </CardTitle>
        <CardDescription>
          Consultație: {consultationTitle}
        </CardDescription>
        <div className="text-sm text-muted-foreground">
          Data: {formatDate(scheduledAt)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Students List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Elevi ({students.length})</h3>
          
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getAttendanceIcon(attendance[student.id])}
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={getAttendanceButtonVariant(student.id, 'Present')}
                  onClick={() => handleAttendanceChange(student.id, 'Present')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Prezent
                </Button>
                
                <Button
                  size="sm"
                  variant={getAttendanceButtonVariant(student.id, 'Late')}
                  onClick={() => handleAttendanceChange(student.id, 'Late')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Întârziat
                </Button>
                
                <Button
                  size="sm"
                  variant={getAttendanceButtonVariant(student.id, 'Absent')}
                  onClick={() => handleAttendanceChange(student.id, 'Absent')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Absent
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Lesson Notes */}
        <div className="space-y-2">
          <Label htmlFor="lessonNotes">Note despre lecție (opțional)</Label>
          <Textarea
            id="lessonNotes"
            value={lessonNotes}
            onChange={(e) => setLessonNotes(e.target.value)}
            placeholder="Ex: Am acoperit ecuații de gradul 2, tema pentru acasă..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {lessonNotes.length}/500 caractere
          </p>
        </div>

        {/* Summary */}
        {Object.keys(attendance).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Rezumat prezență:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Prezenți: {Object.values(attendance).filter(status => status === 'Present').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span>Întârziați: {Object.values(attendance).filter(status => status === 'Late').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Absenți: {Object.values(attendance).filter(status => status === 'Absent').length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveAttendance}
            disabled={saving || !allStudentsMarked}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Se salvează...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvează Prezența
              </>
            )}
          </Button>
        </div>

        {/* Warning if not all students marked */}
        {!allStudentsMarked && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Marchează prezența pentru toți elevii înainte de a salva.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
