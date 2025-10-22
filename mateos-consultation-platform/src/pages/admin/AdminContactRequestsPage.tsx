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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import type { ContactRequestDto } from '@/services/adminService';
import { Calendar, Eye, Mail, MessageSquare, Phone, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredRequests, setFilteredRequests] = useState<ContactRequestDto[]>([]);

  // Dialog states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequestDto | null>(null);
  const [newStatus, setNewStatus] = useState<'New' | 'InProgress' | 'Completed'>('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllContactRequests();
      setRequests(result.items);
      setFilteredRequests(result.items);
    } catch (error) {
      console.error('Failed to load contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    try {
      await adminService.updateContactRequestStatus(
        selectedRequest.id,
        newStatus,
        adminNotes || undefined
      );
      setIsStatusDialogOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');
      loadRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedRequest || !responseMessage.trim()) return;
    try {
      await adminService.respondToContactRequest(selectedRequest.id, responseMessage);
      setIsResponseDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
      loadRequests();
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  const openDetailsDialog = (request: ContactRequestDto) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const openStatusDialog = (request: ContactRequestDto) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setAdminNotes(request.adminNotes || '');
    setIsStatusDialogOpen(true);
  };

  const openResponseDialog = (request: ContactRequestDto) => {
    setSelectedRequest(request);
    setResponseMessage('');
    setIsResponseDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'New':
        return 'destructive';
      case 'InProgress':
        return 'secondary';
      case 'Completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'New':
        return 'Nou';
      case 'InProgress':
        return 'În Progres';
      case 'Completed':
        return 'Finalizat';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitări de Contact</h1>
        <p className="text-gray-600">Gestionează toate solicitările de contact primite</p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Noi</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'New').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">În Progres</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'InProgress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Finalizate</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.length}
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
              placeholder="Caută după nume, email sau subiect..."
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
              variant={statusFilter === 'New' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('New')}
            >
              Noi
            </Button>
            <Button
              variant={statusFilter === 'InProgress' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('InProgress')}
            >
              În Progres
            </Button>
            <Button
              variant={statusFilter === 'Completed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Completed')}
            >
              Finalizate
            </Button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
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
                  <TableHead>Nume</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subiect</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {request.email}
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {request.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{request.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString('ro-RO')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsDialog(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStatusDialog(request)}
                        >
                          Status
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openResponseDialog(request)}
                        >
                          Răspunde
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Total Count */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {filteredRequests.length} {filteredRequests.length === 1 ? 'solicitare' : 'solicitări'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalii Solicitare</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nume</label>
                  <p className="text-base">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                      {getStatusLabel(selectedRequest.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-base">{selectedRequest.email}</p>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <p className="text-base">{selectedRequest.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Subiect</label>
                <p className="text-base">{selectedRequest.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mesaj</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-base whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>
              {selectedRequest.adminNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notițe Admin</label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                    <p className="text-base whitespace-pre-wrap">{selectedRequest.adminNotes}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <label className="font-medium">Data creării:</label>
                  <p>{new Date(selectedRequest.createdAt).toLocaleString('ro-RO')}</p>
                </div>
                {selectedRequest.resolvedAt && (
                  <div>
                    <label className="font-medium">Data rezolvării:</label>
                    <p>{new Date(selectedRequest.resolvedAt).toLocaleString('ro-RO')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizează Status</DialogTitle>
            <DialogDescription>
              Schimbă statusul solicitării și adaugă notițe administrative
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status Nou</label>
              <Select value={newStatus} onValueChange={(value: 'New' | 'InProgress' | 'Completed') => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">Nou</SelectItem>
                  <SelectItem value="InProgress">În Progres</SelectItem>
                  <SelectItem value="Completed">Finalizat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notițe Administrative</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Adaugă notițe despre statusul acestei solicitări..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleUpdateStatus}>Actualizează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Răspunde la Solicitare</DialogTitle>
            <DialogDescription>
              Trimite un răspuns prin email la {selectedRequest?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Mesaj Răspuns</label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Scrie răspunsul tău aici..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSendResponse} disabled={!responseMessage.trim()}>
              Trimite Răspuns
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
