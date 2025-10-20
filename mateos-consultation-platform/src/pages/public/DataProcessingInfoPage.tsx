/**
 * DataProcessingInfoPage - Pagină publică cu informații GDPR
 * 
 * Funcționalitate:
 * - Transparency page (public)
 * - Ce date colectăm
 * - De ce le colectăm (purposes)
 * - Cât timp le păstrăm
 * - Cu cine le distribuim (third parties)
 * - Drepturile utilizatorilor (GDPR)
 * - Contact pentru data protection
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/Logo';
import { ConsentService } from '@/services/consentService';
import type { DataProcessingInfoDto } from '@/types';
import { 
  AlertCircle, 
  Clock, 
  Database, 
  Eye, 
  FileText, 
  Loader2, 
  Mail, 
  Shield, 
  Users
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const DataProcessingInfoPage: FC = () => {
  const [dataInfo, setDataInfo] = useState<DataProcessingInfoDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataProcessingInfo();
  }, []);

  const loadDataProcessingInfo = async () => {
    try {
      setLoading(true);
      const info = await ConsentService.getDataProcessingInfo();
      setDataInfo(info);
    } catch (error) {
      console.error('Error loading data processing info:', error);
      // Fallback data dacă API-ul nu funcționează
      setDataInfo({
        controller: 'Mateos Platform SRL',
        contactEmail: 'privacy@mateos.ro',
        dataProtectionOfficer: 'dpo@mateos.ro',
        purposes: [
          {
            id: 'dataProcessing',
            name: 'Procesarea datelor pentru servicii educaționale',
            description: 'Colectăm și procesăm datele pentru a oferi servicii de educație online',
            dataTypes: ['Nume', 'Email', 'Telefon', 'Date de naștere', 'Informații educaționale'],
            isRequired: true,
            legalBasis: 'Consimțământ explicit',
            retentionPeriod: '3 ani după încetarea relației contractuale'
          },
          {
            id: 'marketing',
            name: 'Marketing și comunicări comerciale',
            description: 'Trimitem comunicări despre serviciile noastre și oferte speciale',
            dataTypes: ['Email', 'Preferințe de comunicare'],
            isRequired: false,
            legalBasis: 'Consimțământ explicit',
            retentionPeriod: '2 ani sau până la retragerea consimțământului'
          }
        ],
        dataRetentionPeriods: {
          'userData': '3 ani după încetarea relației contractuale',
          'marketingData': '2 ani sau până la retragerea consimțământului',
          'paymentData': '10 ani conform legislației fiscale',
          'communicationData': '3 ani'
        },
        thirdParties: [
          {
            name: 'Stripe',
            purpose: 'Procesarea plăților',
            dataTypes: ['Date de plată', 'Informații de facturare']
          },
          {
            name: 'SendGrid',
            purpose: 'Trimiterea emailurilor',
            dataTypes: ['Email', 'Nume']
          }
        ],
        userRights: [
          {
            right: 'Dreptul de acces',
            description: 'Aveți dreptul să știți ce date personale procesăm despre dvs.',
            howToExercise: 'Contactați-ne la privacy@mateos.ro'
          },
          {
            right: 'Dreptul la rectificare',
            description: 'Aveți dreptul să corectați datele inexacte sau incomplete.',
            howToExercise: 'Actualizați profilul sau contactați-ne'
          },
          {
            right: 'Dreptul la ștergere',
            description: 'Aveți dreptul să solicitați ștergerea datelor personale.',
            howToExercise: 'Contactați-ne la privacy@mateos.ro'
          },
          {
            right: 'Dreptul la portabilitate',
            description: 'Aveți dreptul să primiți datele într-un format structurat.',
            howToExercise: 'Solicitați exportul datelor prin platformă'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!dataInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nu s-au putut încărca informațiile</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <Logo size="lg" variant="rounded" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Informații despre Procesarea Datelor Personale
          </h1>
          <p className="text-gray-600">
            Transparență completă despre cum colectăm, procesăm și protejăm datele dvs. personale
          </p>
        </div>

        {/* Controller Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Responsabilul Procesării
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Numele responsabilului</h4>
                <p className="text-muted-foreground">{dataInfo.controller}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${dataInfo.contactEmail}`} className="text-blue-600 hover:underline">
                    {dataInfo.contactEmail}
                  </a>
                </div>
              </div>
              {dataInfo.dataProtectionOfficer && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-2">Responsabil cu protecția datelor (DPO)</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${dataInfo.dataProtectionOfficer}`} className="text-blue-600 hover:underline">
                      {dataInfo.dataProtectionOfficer}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purposes of Processing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Scopurile Procesării Datelor
            </CardTitle>
            <CardDescription>
              De ce colectăm și procesăm datele dvs. personale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataInfo.purposes.map((purpose) => (
                <div key={purpose.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{purpose.name}</h4>
                    <div className="flex gap-2">
                      {purpose.isRequired ? (
                        <Badge variant="secondary">Obligatoriu</Badge>
                      ) : (
                        <Badge variant="outline">Opțional</Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{purpose.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tipuri de date:</span>
                      <p className="text-muted-foreground">{purpose.dataTypes.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Baza legală:</span>
                      <p className="text-muted-foreground">{purpose.legalBasis}</p>
                    </div>
                    <div>
                      <span className="font-medium">Perioada de păstrare:</span>
                      <p className="text-muted-foreground">{purpose.retentionPeriod}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Retention Periods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Perioadele de Păstrare a Datelor
            </CardTitle>
            <CardDescription>
              Cât timp păstrăm diferitele tipuri de date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(dataInfo.dataRetentionPeriods).map(([dataType, period]) => (
                <div key={dataType} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{dataType}</span>
                  <span className="text-muted-foreground">{period}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Third Parties */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Terți la Care Distribuim Datele
            </CardTitle>
            <CardDescription>
              Cu cine partajăm datele dvs. personale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataInfo.thirdParties.map((thirdParty, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{thirdParty.name}</h4>
                  <p className="text-muted-foreground mb-2">{thirdParty.purpose}</p>
                  <div>
                    <span className="font-medium">Date partajate:</span>
                    <p className="text-muted-foreground">{thirdParty.dataTypes.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Drepturile Dvs. (GDPR)
            </CardTitle>
            <CardDescription>
              Ce drepturi aveți în legătură cu datele dvs. personale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataInfo.userRights.map((right, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{right.right}</h4>
                  <p className="text-muted-foreground mb-2">{right.description}</p>
                  <div>
                    <span className="font-medium">Cum să exercitați:</span>
                    <p className="text-muted-foreground">{right.howToExercise}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact pentru Protecția Datelor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Pentru întrebări generale</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${dataInfo.contactEmail}`} className="text-blue-600 hover:underline">
                    {dataInfo.contactEmail}
                  </a>
                </div>
              </div>
              
              {dataInfo.dataProtectionOfficer && (
                <div>
                  <h4 className="font-semibold mb-2">Pentru probleme de protecție a datelor</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${dataInfo.dataProtectionOfficer}`} className="text-blue-600 hover:underline">
                      {dataInfo.dataProtectionOfficer}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Notificare importantă:</strong> Această pagină este actualizată periodic pentru a reflecta 
            modificările în procesarea datelor. Vă recomandăm să o consultați regulat. Pentru întrebări 
            specifice despre datele dvs. personale, vă rugăm să ne contactați direct.
          </AlertDescription>
        </Alert>

        {/* Footer Links */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p className="mb-2">Sau explorează:</p>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-500">
              Pagina principală
            </Link>
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Autentificare
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
