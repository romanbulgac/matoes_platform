import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { TeacherApplicationService } from '@/services/teacherApplicationService';
import type { TeacherApplicationDto } from '@/types';
import { AlertCircle, Award, FileText, GraduationCap, Loader2, StarIcon, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function TeacherApplicationPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TeacherApplicationDto>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    education: '',
    experience: '',
    specializations: [],
    preferredAgeGroups: [],
    motivation: '',
    teachingMethodology: '',
    availableHours: '',
    agreedToBackgroundCheck: false,
    agreedToTerms: false,
    agreedToDataProcessing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const mathSpecializations = [
    'Aritmetică',
    'Algebră',
    'Geometrie',
    'Trigonometrie',
    'Analiză matematică',
    'Matematică financiară',
    'Statistică și probabilități',
    'Matematică aplicată',
    'Pregătire pentru examene',
    'Matematică pentru concursuri'
  ];

  const ageGroups = [
    'Clasa 5-6',
    'Clasa 7-8',
    'Clasa 9-10',
    'Clasa 11-12',
    'Studenți universitari',
    'Adulți'
  ];

  const handleChange = (field: keyof TeacherApplicationDto, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationChange = (specialization: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s: string) => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    setFormData((prev: any) => ({
      ...prev,
      preferredAgeGroups: prev.preferredAgeGroups.includes(ageGroup)
        ? prev.preferredAgeGroups.filter((g: string) => g !== ageGroup)
        : [...prev.preferredAgeGroups, ageGroup]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.dateOfBirth);
      case 2:
        return !!(formData.education && formData.experience && formData.specializations.length > 0);
      case 3:
        return !!(formData.motivation && formData.teachingMethodology && formData.availableHours);
      case 4:
        return formData.agreedToBackgroundCheck && (formData.agreedToDataProcessing || false);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: 'Eroare de validare',
        description: 'Completează toate câmpurile obligatorii din această secțiune',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: 'Eroare de validare',
        description: 'Completează toate câmpurile obligatorii',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await TeacherApplicationService.submitApplication(formData);
      
      toast({
        title: 'Aplicație trimisă cu succes!',
        description: `Codul de urmărire: ${response.trackingCode}. Te vom contacta în 3-5 zile lucrătoare.`,
      });

      navigate('/track-application', { 
        state: { 
          trackingCode: response.trackingCode,
          email: formData.email 
        }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Eroare la trimiterea aplicației',
        description: 'A apărut o eroare. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <Logo size="lg" variant="rounded" className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aplică ca Profesor de Matematică
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Alătură-te echipei noastre de profesori experți și ajută studenții să exceleze în matematică. 
            Completează formularul de mai jos pentru a începe procesul de aplicare.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < totalSteps && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Informații Personale</span>
            <span>Educație</span>
            <span>Motivație</span>
            <span>Consimțăminte</span>
          </div>
        </div>

        {/* Beneficii */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <StarIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Program Flexibil</h3>
              <p className="text-sm text-gray-600">Lucrează când îți convine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Venituri Competitive</h3>
              <p className="text-sm text-gray-600">100-200 lei/oră</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Dezvoltare Profesională</h3>
              <p className="text-sm text-gray-600">Training și suport continuu</p>
            </CardContent>
          </Card>
        </div>

        {/* Formular Multistep */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5" />
              {currentStep === 1 && 'Informații Personale'}
              {currentStep === 2 && 'Educație și Calificări'}
              {currentStep === 3 && 'Motivație și Disponibilitate'}
              {currentStep === 4 && 'Consimțăminte GDPR'}
            </CardTitle>
            <CardDescription>
              Pasul {currentStep} din {totalSteps}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="FirstName">Prenume *</Label>
                    <Input
                      id="FirstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="Prenumele tău"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="LastName">Nume *</Label>
                    <Input
                      id="LastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Numele tău"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="email@exemplu.ro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="PhoneNumber">Telefon *</Label>
                    <Input
                      id="PhoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="+40 123 456 789"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="DateOfBirth">Data nașterii *</Label>
                    <Input
                      id="DateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Education">Nivel educație *</Label>
                    <Select value={formData.education} onValueChange={(value) => handleChange('education', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează nivelul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licenta">Licență</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="doctorat">Doctorat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiența în predare *</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează experiența" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Fără experiență - 1 an</SelectItem>
                        <SelectItem value="1-3">1-3 ani</SelectItem>
                        <SelectItem value="3-5">3-5 ani</SelectItem>
                        <SelectItem value="5-10">5-10 ani</SelectItem>
                        <SelectItem value="10+">Peste 10 ani</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Specializări în Matematică *</Label>
                  <p className="text-sm text-muted-foreground">Selectează domeniile în care ai experiență (minim una):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mathSpecializations.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationChange(spec)}
                        />
                        <Label htmlFor={spec} className="text-sm cursor-pointer">
                          {spec}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Motivation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="Motivation">De ce vrei să predai pe Mateos? *</Label>
                  <Textarea
                    id="Motivation"
                    value={formData.motivation || "" || "" || "" || "" || "" || "" || "" || "" || "" || "" || ""}
                    onChange={(e) => handleChange('motivation', e.target.value)}
                    placeholder="Descrie motivația ta pentru a preda matematică și de ce ai alege platforma Mateos..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.motivation || "" || "" || "" || "" || "" || "" || "" || "" || "" || "" || "".length}/500 caractere
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="TeachingMethodology">Descrie metodica ta de predare *</Label>
                  <Textarea
                    id="TeachingMethodology"
                    value={formData.teachingMethodology || "" || "" || "" || "" || "" || "" || "" || "" || "" || "" || ""}
                    onChange={(e) => handleChange('teachingMethodology', e.target.value)}
                    placeholder="Cum abordezi predarea matematicii? Ce metode folosești pentru a ajuta elevii să înțeleagă conceptele?"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.teachingMethodology || "" || "" || "" || "" || "" || "" || "" || "" || "" || "" || "".length}/500 caractere
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Disponibilitatea ta *</Label>
                  <RadioGroup value={formData.availableHours} onValueChange={(value) => handleChange('availableHours', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dimineata" id="dimineata" />
                      <Label htmlFor="dimineata">Dimineața (8:00-12:00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dupa-amiaza" id="dupa-amiaza" />
                      <Label htmlFor="dupa-amiaza">După-amiaza (12:00-18:00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seara" id="seara" />
                      <Label htmlFor="seara">Seara (18:00-22:00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexibil" id="flexibil" />
                      <Label htmlFor="flexibil">Program flexibil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekend" id="weekend" />
                      <Label htmlFor="weekend">Doar weekend</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Grupuri de vârstă preferate</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ageGroups.map((ageGroup) => (
                      <div key={ageGroup} className="flex items-center space-x-2">
                        <Checkbox
                          id={ageGroup}
                          checked={(formData.preferredAgeGroups || []).includes(ageGroup)}
                          onCheckedChange={() => handleAgeGroupChange(ageGroup)}
                        />
                        <Label htmlFor={ageGroup} className="text-sm cursor-pointer">
                          {ageGroup}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Consents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Pentru a putea lucra cu noi, trebuie să accepți următoarele consimțăminte conform GDPR.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="backgroundCheck"
                      checked={formData.agreedToBackgroundCheck}
                      onCheckedChange={(checked) => handleChange('agreedToBackgroundCheck', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="backgroundCheck" className="text-sm font-medium cursor-pointer">
                        Consimțământ pentru verificare de antecedente *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Sunt de acord ca Mateos să verifice antecedentele mele pentru a asigura siguranța elevilor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataProcessing"
                      checked={formData.agreedToDataProcessing}
                      onCheckedChange={(checked) => handleChange('agreedToDataProcessing', checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="dataProcessing" className="text-sm font-medium cursor-pointer">
                        Consimțământ pentru procesarea datelor personale *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Sunt de acord cu procesarea datelor mele personale conform{' '}
                        <Link to="/data-processing-info" className="text-blue-600 hover:underline">
                          Politicii de Confidențialitate
                        </Link>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Ce se întâmplă după aplicare?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Vei primi un cod de urmărire pentru aplicația ta</li>
                    <li>• Echipa noastră va evalua aplicația în 3-5 zile lucrătoare</li>
                    <li>• Dacă ești acceptat, vei fi contactat pentru următorii pași</li>
                    <li>• Vei primi training și suport pentru a începe să predai</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Înapoi
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                >
                  Următorul
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!validateStep(4) || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    'Trimite Aplicația'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Link-uri suplimentare */}
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
}
