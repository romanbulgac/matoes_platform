import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography-bundle';
import { ConsultationDto } from '@/types/api';
import { Check, CheckCircle2, X, XCircle } from 'lucide-react';
import { FC, useState } from 'react';

interface AttendanceManagementProps {
  consultation: ConsultationDto;
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  present: boolean;
}

export const AttendanceManagement: FC<AttendanceManagementProps> = ({ consultation }) => {
  // Mock data - в реальности будет из API
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(
    consultation.participants.map(student => ({
      studentId: student.id,
      studentName: `${student.name} ${student.surname}`,
      present: true, // По умолчанию все присутствуют
    }))
  );

  const [isSaving, setIsSaving] = useState(false);

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? { ...record, present: !record.present }
          : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save attendance
      console.log('Saving attendance:', attendance);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      // Show success toast
    } catch (error) {
      console.error('Error saving attendance:', error);
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = attendance.filter(r => r.present).length;
  const absentCount = attendance.length - presentCount;

  if (consultation.participants.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <Typography.H3 className="text-lg">Prezență</Typography.H3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Check className="w-3 h-3 mr-1" />
              {presentCount} Prezenți
            </Badge>
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
              <X className="w-3 h-3 mr-1" />
              {absentCount} Absenți
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          {attendance.map(record => (
            <div
              key={record.studentId}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={record.present}
                  onCheckedChange={() => toggleAttendance(record.studentId)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Typography.P className="font-medium">{record.studentName}</Typography.P>
              </div>

              <div className="flex items-center gap-2">
                {record.present ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Prezent
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? 'Se salvează...' : 'Salvează prezența'}
          </Button>
        </div>

        {/* Past Consultations Attendance - Placeholder */}
        <div className="mt-6 pt-6 border-t">
          <Typography.H4 className="text-sm text-slate-500 mb-3">Prezență consultații anterioare</Typography.H4>
          <Typography.P className="text-sm text-slate-400">
            Istoricul prezenței va fi afișat aici
          </Typography.P>
        </div>
      </CardContent>
    </Card>
  );
};
