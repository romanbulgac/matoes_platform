/**
 * TrackApplicationPage - Pagină publică pentru urmărirea aplicațiilor profesorilor
 * 
 * Funcționalitate:
 * - Input email pentru căutare aplicație
 * - Display status cu timeline vizual
 * - Reviewer notes (dacă există)
 * - Next steps pentru fiecare status
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
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
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const TrackApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [application, setApplication] = useState<TeacherApplicationViewDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Pre-populate email from navigation state
  useState(() => {
    const state = location.state as { email?: string; trackingCode?: string } | null;
    if (state?.email) {
      setEmail(state.email);
      if (state.trackingCode) {
        // Auto-search if we have tracking code
        handleSearch();
      }
    }
  });

  const handleSearch = async () => {
    if (!email.trim()) {
      toast({
        title: 'Eroare',
        description: 'Introdu adresa de email',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const app = await TeacherApplicationService.trackByEmail(email.trim());
      setApplication(app);
      setSearched(true);
    } catch (error) {
      console.error('Error tracking application:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a găsit nicio aplicație cu această adresă de email',
        variant: 'destructive',
      });
      setApplication(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'UnderReview':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Aplicația ta a fost primită și este în așteptarea evaluării.';
      case 'UnderReview':
        return 'Aplicația ta este în curs de evaluare de către echipa noastră.';
      case 'Approved':
        return 'Felicitări! Aplicația ta a fost aprobată. Vei fi contactat în curând.';
      case 'Rejected':
        return 'Ne pare rău, dar aplicația ta nu a fost acceptată.';
      default:
        return 'Status necunoscut.';
    }
  };

  const getNextSteps = (status: string) => {
    switch (status) {
      case 'Pending':
        return [
          'Echipa noastră va evalua aplicația în 3-5 zile lucrătoare',
          'Vei primi un email cu actualizarea statusului',
          'Dacă ești acceptat, vei fi contactat pentru următorii pași'
        ];
      case 'UnderReview':
        return [
          'Echipa noastră analizează în detaliu aplicația ta',
          'Se poate ca să fii contactat pentru informații suplimentare',
          'Vei primi o notificare când evaluarea este completă'
        ];
      case 'Approved':
        return [
          'Vei primi un email cu instrucțiunile pentru următorii pași',
          'Vei fi invitat la o sesiune de onboarding',
          'Vei primi acces la platforma de predare și training'
        ];
      case 'Rejected':
        return [
          'Poți aplica din nou după 6 luni',
          'Îmbunătățește-ți profilul și aplică din nou',
          'Contactează-ne dacă ai întrebări despre decizie'
        ];
      default:
        return [];
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <Logo size="lg" variant="rounded" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Urmărește Aplicația Ta
          </h1>
          <p className="text-gray-600">
            Verifică statusul aplicației tale pentru poziția de profesor
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Căutare Aplicație
            </CardTitle>
            <CardDescription>
              Introdu adresa de email folosită la aplicare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresa de Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplu.ro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={loading || !email.trim()}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        {searched && (
          <>
            {application ? (
              <div className="space-y-6">
                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          Status Aplicație
                        </CardTitle>
                        <CardDescription>
                          Aplicația pentru {application.firstName} {application.lastName}
                        </CardDescription>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-4">{getStatusMessage(application.status)}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cod de urmărire:</span>
                        <p className="text-muted-foreground font-mono">{application.trackingCode}</p>
                      </div>
                      <div>
                        <span className="font-medium">Data aplicării:</span>
                        <p className="text-muted-foreground">{formatDate(application.submittedAt)}</p>
                      </div>
                      {application.reviewedAt && (
                        <div>
                          <span className="font-medium">Data evaluării:</span>
                          <p className="text-muted-foreground">{formatDate(application.reviewedAt)}</p>
                        </div>
                      )}
                      {application.reviewedBy && (
                        <div>
                          <span className="font-medium">Evaluat de:</span>
                          <p className="text-muted-foreground">{application.reviewedBy}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviewer Notes */}
                {application.reviewerNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Note de la Evaluator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{application.reviewerNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Rejection Reason */}
                {application.status === 'Rejected' && application.rejectionReason && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Motivul respingerii:</strong> {application.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Următorii Pași</CardTitle>
                    <CardDescription>
                      Ce se întâmplă în continuare cu aplicația ta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getNextSteps(application.status).map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Ai Întrebări?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Dacă ai întrebări despre aplicația ta sau procesul de evaluare, 
                      nu ezita să ne contactezi.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <a href="mailto:hr@mateos.ro">
                          <Mail className="h-4 w-4 mr-2" />
                          hr@mateos.ro
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/">
                          Pagina Principală
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Nu s-a găsit nicio aplicație</p>
                    <p className="text-sm mb-4">
                      Nu există nicio aplicație cu adresa de email "{email}"
                    </p>
                    <Button asChild>
                      <Link to="/aplicare-profesor">
                        Aplică Acum
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Quick Links */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p className="mb-2">Sau explorează:</p>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-500">
              Pagina principală
            </Link>
            <Link to="/aplicare-profesor" className="text-blue-600 hover:text-blue-500">
              Aplică ca Profesor
            </Link>
            <Link to="/preturi" className="text-blue-600 hover:text-blue-500">
              Vezi prețurile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
