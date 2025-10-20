import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { adminService } from '@/services';
import type { StudentRegistrationDto } from '@/services/adminService';
import { Calendar, CheckCircle, GraduationCap, Mail, Phone, Search, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminStudentRegistrationsPage() {
  const [registrations, setRegistrations] = useState<StudentRegistrationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<StudentRegistrationDto[]>([]);

  // Dialog states
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistrationDto | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.childClass.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      const statusNumber = getStatusNumber(statusFilter);
      filtered = filtered.filter((reg) => reg.status === statusNumber);
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllStudentRegistrations();
      setRegistrations(result.items);
      setFilteredRegistrations(result.items);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRegistration) return;
    try {
      if (actionType === 'approve') {
        await adminService.approveStudentRegistration(selectedRegistration.id, notes || undefined);
      } else {
        await adminService.rejectStudentRegistration(selectedRegistration.id, notes || undefined);
      }
      
      setIsActionDialogOpen(false);
      setSelectedRegistration(null);
      setNotes('');
      loadRegistrations();
    } catch (error) {
      console.error(`Failed to ${actionType} registration:`, error);
    }
  };

  const openActionDialog = (registration: StudentRegistrationDto, action: 'approve' | 'reject') => {
    setSelectedRegistration(registration);
    setActionType(action);
    setNotes('');
    setIsActionDialogOpen(true);
  };

  // Helper functions to convert between status number and string
  // Backend status: New=0, Contacted=1, ConsultationScheduled=2, Enrolled=3, Cancelled=4
  const getStatusNumber = (statusString: string): number => {
    switch (statusString) {
      case 'Pending': return 0; // New
      case 'Approved': return 1; // Contacted
      case 'Rejected': return 4; // Cancelled
      default: return 0;
    }
  };

  const getStatusBadgeVariant = (status: number): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 1: // Contacted (Approved)
      case 2: // ConsultationScheduled
      case 3: // Enrolled
        return 'default';
      case 0: // New (Pending)
        return 'secondary';
      case 4: // Cancelled (Rejected)
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0: return 'În așteptare'; // New
      case 1: return 'Contactat'; // Contacted
      case 2: return 'Programat'; // ConsultationScheduled
      case 3: return 'Înrolat'; // Enrolled
      case 4: return 'Anulat'; // Cancelled
      default: return 'Necunoscut';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Înregistrări Studenți</h1>
        <p className="text-gray-600">Gestionează cererile de înregistrare pentru studenți</p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">În așteptare</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprobate</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 1).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Respinse</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 4).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Caută după nume, email sau clasă..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === '' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('')}
            >
              Toate
            </Button>
            <Button
              variant={statusFilter === 'Pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Pending')}
            >
              În așteptare
            </Button>
            <Button
              variant={statusFilter === 'Approved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Approved')}
            >
              Aprobate
            </Button>
            <Button
              variant={statusFilter === 'Rejected' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Rejected')}
            >
              Respinse
            </Button>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Copil</TableHead>
                  <TableHead>Email Părinte</TableHead>
                  <TableHead>Clasă</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Nume Părinte</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data înregistrării</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {registration.childName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {registration.parentEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        {registration.childClass}
                      </div>
                    </TableCell>
                    <TableCell>
                      {registration.parentPhone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {registration.parentPhone}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {registration.parentName ? (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3 text-gray-400" />
                          {registration.parentName}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(registration.status)}>
                        {getStatusLabel(registration.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.createdTime).toLocaleDateString('ro-RO')}
                    </TableCell>
                    <TableCell className="text-right">
                      {registration.status === 0 && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionDialog(registration, 'approve')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobă
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionDialog(registration, 'reject')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Respinge
                          </Button>
                        </div>
                      )}
                      {registration.status !== 0 && (
                        <div className="text-sm text-gray-500">
                          {registration.contactedAt
                            ? `Procesat: ${new Date(registration.contactedAt).toLocaleDateString('ro-RO')}`
                            : '-'}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Total Count */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'înregistrare' : 'înregistrări'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprobă Înregistrare' : 'Respinge Înregistrare'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Confirmi aprobarea înregistrării pentru ${selectedRegistration?.childName}? Va fi creat un cont de student.`
                : `Confirmi respingerea înregistrării pentru ${selectedRegistration?.childName}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRegistration && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student:</span>
                  <span className="font-medium">
                    {selectedRegistration.childName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clasă:</span>
                  <span className="font-medium">{selectedRegistration.childClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Părinte:</span>
                  <span className="font-medium">{selectedRegistration.parentEmail}</span>
                </div>
                {selectedRegistration.parentName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nume Părinte:</span>
                    <span className="font-medium">{selectedRegistration.parentName}</span>
                  </div>
                )}
                {selectedRegistration.parentPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-medium">{selectedRegistration.parentPhone}</span>
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Notițe (opțional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adaugă notițe sau motivul deciziei..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleAction}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {actionType === 'approve' ? 'Aprobă' : 'Respinge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
