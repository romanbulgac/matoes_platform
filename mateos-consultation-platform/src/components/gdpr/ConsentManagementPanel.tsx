/**
 * ConsentManagementPanel - Component pentru gestionarea consimțămințelor GDPR
 * 
 * Funcționalitate:
 * - Toggle switches pentru consents
 * - History view simplu
 * - Gestionare consents pentru copii (pentru părinți)
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ConsentService } from '@/services/consentService';
import type { ConsentDto, ConsentHistoryDto, DataPurposeDto } from '@/types';
import { 
  AlertCircle, 
  Clock, 
  History, 
  Loader2, 
  Shield, 
  ShieldCheck, 
  ShieldX
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface ConsentManagementPanelProps {
  userId: string;
  managedBy?: 'parent';
  onConsentChange?: (consentType: string, granted: boolean) => void;
}

export const ConsentManagementPanel: FC<ConsentManagementPanelProps> = ({
  userId,
  managedBy,
  onConsentChange
}) => {
  const { toast } = useToast();
  
  const [purposes, setPurposes] = useState<DataPurposeDto[]>([]);
  const [consents, setConsents] = useState<ConsentDto[]>([]);
  const [consentHistory, setConsentHistory] = useState<ConsentHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedConsentType, setSelectedConsentType] = useState<string>('');
  const [withdrawalReason, setWithdrawalReason] = useState('');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purposesData, consentsData] = await Promise.all([
        ConsentService.getPurposes(),
        ConsentService.getUserConsents(userId)
      ]);
      
      setPurposes(purposesData);
      setConsents(consentsData);
    } catch (error) {
      console.error('Error loading consent data:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca consimțămintele',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConsentHistory = async (consentType: string) => {
    try {
      const history = await ConsentService.getConsentHistory(userId);
      const filteredHistory = history.filter(h => h.consentType === consentType);
      setConsentHistory(filteredHistory);
    } catch (error) {
      console.error('Error loading consent history:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut încărca istoricul',
        variant: 'destructive',
      });
    }
  };

  const handleConsentToggle = async (consentType: string, granted: boolean) => {
    try {
      setUpdating(consentType);
      
      if (granted) {
        await ConsentService.grantConsent(consentType, userId);
        toast({
          title: 'Succes',
          description: 'Consimțământul a fost acordat',
        });
      } else {
        // Pentru retragere, afișează dialog pentru motiv
        setSelectedConsentType(consentType);
        setWithdrawalReason('');
        return;
      }

      // Reload data
      await loadData();
      onConsentChange?.(consentType, granted);
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza consimțământul',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleWithdrawConsent = async () => {
    if (!withdrawalReason.trim()) {
      toast({
        title: 'Eroare',
        description: 'Introdu motivul retragerii',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(selectedConsentType);
      await ConsentService.withdrawConsent(selectedConsentType, withdrawalReason, userId);
      
      toast({
        title: 'Succes',
        description: 'Consimțământul a fost retras',
      });

      // Reload data
      await loadData();
      onConsentChange?.(selectedConsentType, false);
      
      // Close dialog
      setSelectedConsentType('');
      setWithdrawalReason('');
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut retrage consimțământul',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const getConsentStatus = (consentType: string) => {
    const consent = consents.find(c => c.consentType === consentType);
    return consent?.isGranted || false;
  };

  const getConsentIcon = (consentType: string) => {
    const isGranted = getConsentStatus(consentType);
    if (isGranted) {
      return <ShieldCheck className="h-4 w-4 text-green-600" />;
    }
    return <ShieldX className="h-4 w-4 text-red-600" />;
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
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Se încarcă consimțămintele...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestionare Consimțăminte GDPR
          </CardTitle>
          <CardDescription>
            {managedBy === 'parent' 
              ? 'Controlează consimțămintele copilului tău'
              : 'Controlează ce date pot fi procesate'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {purposes.map((purpose) => {
              const isGranted = getConsentStatus(purpose.id);
              const isUpdating = updating === purpose.id;
              
              return (
                <div key={purpose.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getConsentIcon(purpose.id)}
                        <h4 className="font-semibold">{purpose.name}</h4>
                        {purpose.isRequired && (
                          <Badge variant="secondary">Obligatoriu</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {purpose.description}
                      </p>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        <p><strong>Ce date:</strong> {purpose.dataTypes.join(', ')}</p>
                        <p><strong>Baza legală:</strong> {purpose.legalBasis}</p>
                        <p><strong>Perioada de păstrare:</strong> {purpose.retentionPeriodDays}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={isGranted}
                        onCheckedChange={(granted) => handleConsentToggle(purpose.id, granted)}
                        disabled={isUpdating || purpose.isRequired}
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedConsentType(purpose.id);
                          loadConsentHistory(purpose.id);
                          setShowHistory(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {isUpdating && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Se actualizează...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {purposes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există consimțăminte configurate</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Istoric Consimțăminte</DialogTitle>
            <DialogDescription>
              Istoricul modificărilor pentru {selectedConsentType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {consentHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nu există istoric pentru acest consimțământ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consentHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {entry.action === 'Granted' ? (
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <ShieldX className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {entry.action === 'Granted' ? 'Acordat' : 'Retras'}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(entry.performedAt)}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Motiv: {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Reason Dialog */}
      <Dialog open={!!selectedConsentType && !showHistory} onOpenChange={() => setSelectedConsentType('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retrage Consimțământul</DialogTitle>
            <DialogDescription>
              Introdu motivul pentru care retragi consimțământul pentru {selectedConsentType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdrawalReason">Motivul retragerii *</Label>
              <Textarea
                id="withdrawalReason"
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                placeholder="Explicați de ce retrageți consimțământul..."
                rows={4}
              />
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Retragerea consimțământului poate afecta funcționalitatea platformei.
                Veți fi notificat despre impactul acestei acțiuni.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedConsentType('')}
                disabled={updating === selectedConsentType}
              >
                Anulează
              </Button>
              <Button
                onClick={handleWithdrawConsent}
                disabled={updating === selectedConsentType || !withdrawalReason.trim()}
              >
                {updating === selectedConsentType ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Se retrage...
                  </>
                ) : (
                  'Retrage Consimțământul'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
