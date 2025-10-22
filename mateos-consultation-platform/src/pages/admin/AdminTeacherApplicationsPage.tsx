/**
 * AdminTeacherApplicationsPage - Pagină pentru admin să gestioneze aplicațiile profesorilor
 * 
 * Funcționalitate:
 * - Lista aplicațiilor cu filtre (Pending, Under Review, Approved, Rejected)
 * - Card-uri pentru fiecare aplicație cu acțiuni
 * - Dialog pentru vizualizare detaliată
 * - Butoane pentru approve/reject cu notes
 * - Statistici simple
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TeacherApplicationService } from '@/services/teacherApplicationService';
import type { TeacherApplicationViewDto } from '@/types';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Loader2, 
  Mail, 
  Search,
  Users,
  XCircle
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export const AdminTeacherApplicationsPage: FC = () => {
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<TeacherApplicationViewDto[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplicationViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected application for details
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplicationViewDto | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const [allApps, appStats] = await Promise.all([
        TeacherApplicationService.getAllApplications(),
        TeacherApplicationService.getApplicationStats()
      ]);
      
      setApplications(allApps);
      setStats(appStats);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca aplicațiile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleViewDetails = (application: TeacherApplicationViewDto) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (applicationId: string) => {
    if (!approvalNotes.trim()) {
      toast({
        title: 'Eroare',
        description: 'Introdu notele pentru aprobare',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(applicationId);
      await TeacherApplicationService.approveApplication(applicationId, {
        applicationId,
        sendWelcomeEmail: true,
        adminNotes: approvalNotes
      });
      
      toast({
        title: 'Succes',
        description: 'Aplicația a fost aprobată',
      });

      loadApplications();
      setShowDetailsDialog(false);
      setApprovalNotes('');
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut aproba aplicația',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Eroare',
        description: 'Introdu motivul respingerii',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(applicationId);
      await TeacherApplicationService.rejectApplication(applicationId, {
        applicationId,
        rejectionReason: rejectionReason,
        adminNotes: ""
      });
      
      toast({
        title: 'Succes',
        description: 'Aplicația a fost respinsă',
      });

      loadApplications();
      setShowDetailsDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut respinge aplicația',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkUnderReview = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);
      await TeacherApplicationService.markAsUnderReview(applicationId, 'Moved to under review');
      
      toast({
        title: 'Succes',
        description: 'Aplicația a fost marcată ca fiind în evaluare',
      });

      loadApplications();
    } catch (error) {
      console.error('Error marking under review:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut marca aplicația',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'UnderReview':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary">În Așteptare</Badge>;
      case 'UnderReview':
        return <Badge variant="default">În Evaluare</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Aprobată</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Respinsă</Badge>;
      default:
        return <Badge variant="outline">Necunoscut</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aplicații Profesori</h1>
          <p className="text-muted-foreground">
            Gestionează aplicațiile pentru pozițiile de profesor
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">În Așteptare</span>
            </div>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">În Evaluare</span>
            </div>
            <p className="text-2xl font-bold">{stats.underReview}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Aprobate</span>
            </div>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Respinse</span>
            </div>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Căutare</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Caută după nume sau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate statusurile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="Pending">În Așteptare</SelectItem>
                  <SelectItem value="UnderReview">În Evaluare</SelectItem>
                  <SelectItem value="Approved">Aprobate</SelectItem>
                  <SelectItem value="Rejected">Respinse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toate ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">În Așteptare ({stats.pending})</TabsTrigger>
          <TabsTrigger value="underReview">În Evaluare ({stats.underReview})</TabsTrigger>
          <TabsTrigger value="approved">Aprobate ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Respinse ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nu există aplicații</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <div>
                            <p className="font-semibold">
                              {application.firstName} {application.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {application.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Aplicat: {formatDate(application.submittedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(application)}
                        >
                          Vezi Detalii
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Other tabs content would be similar but filtered by status */}
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {filteredApplications.filter(app => app.status === 'Pending').map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <div>
                          <p className="font-semibold">
                            {application.firstName} {application.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {application.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Aplicat: {formatDate(application.submittedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(application.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(application)}
                      >
                        Vezi Detalii
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aplicația Profesorului</DialogTitle>
            <DialogDescription>
              {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-2">Informații Personale</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Telefon:</span>
                    <p className="text-muted-foreground">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium">Educație:</span>
                    <p className="text-muted-foreground">{selectedApplication.education}</p>
                  </div>
                  <div>
                    <span className="font-medium">Experiență:</span>
                    <p className="text-muted-foreground">{selectedApplication.experience}</p>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="font-semibold mb-2">Specializări</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h3 className="font-semibold mb-2">Motivație</h3>
                <p className="text-sm text-muted-foreground">{selectedApplication.motivation}</p>
              </div>

              {/* Teaching Methodology */}
              <div>
                <h3 className="font-semibold mb-2">Metodica de Predare</h3>
                <p className="text-sm text-muted-foreground">{selectedApplication.teachingMethodology}</p>
              </div>

              {/* Actions */}
              {selectedApplication.status === 'Pending' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="approvalNotes">Note pentru aprobare</Label>
                    <Textarea
                      id="approvalNotes"
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Introdu notele pentru aprobare..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id)}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      {actionLoading === selectedApplication.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Aprobă
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleMarkUnderReview(selectedApplication.id)}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Marchează în Evaluare
                    </Button>
                  </div>
                </div>
              )}

              {selectedApplication.status === 'Pending' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejectionReason">Motivul respingerii</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Introdu motivul respingerii..."
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={actionLoading === selectedApplication.id}
                  >
                    {actionLoading === selectedApplication.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Respinge
                  </Button>
                </div>
              )}

              {/* Status Info */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedApplication.status)}
                  <span className="font-medium">Status: </span>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                {selectedApplication.reviewerNotes && (
                  <div className="mt-2">
                    <span className="font-medium">Note evaluator:</span>
                    <p className="text-sm text-muted-foreground">{selectedApplication.reviewerNotes}</p>
                  </div>
                )}
                {selectedApplication.rejectionReason && (
                  <div className="mt-2">
                    <span className="font-medium">Motiv respingere:</span>
                    <p className="text-sm text-muted-foreground">{selectedApplication.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};