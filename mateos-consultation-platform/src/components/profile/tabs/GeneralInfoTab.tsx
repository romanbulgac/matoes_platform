import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/hooks/use-alert';
import { UserService } from '@/services/userService';
import { Edit3, Save, Upload, X } from 'lucide-react';
import { FC, useState } from 'react';

/**
 * GeneralInfoTab - вкладка общей информации профиля
 * Позволяет просматривать и редактировать основные данные пользователя
 */
export const GeneralInfoTab: FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phoneNumber: user?.profile?.phone || '',
    bio: '',
    specializations: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Обновляем профиль через API
      await UserService.updateProfile({
        name: formData.firstname,
        surname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      showSuccess('Профиль успешно обновлён');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      phoneNumber: user?.profile?.phone || '',
      bio: '',
      specializations: '',
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    if (user) {
      return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      Student: 'Student',
      Teacher: 'Profesor',
      Administrator: 'Administrator',
      Parent: 'Părinte',
      student: 'Student',
      teacher: 'Profesor',
      admin: 'Administrator',
    };
    return labels[role] || role;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informații generale</CardTitle>
            <CardDescription>
              Gestionează datele tale personale
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Editează
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Anulează
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Se salvează...' : 'Salvează'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.profile?.avatar} />
            <AvatarFallback className="text-2xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Încarcă poză nouă
            </Button>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">Prenume</Label>
            {isEditing ? (
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Prenumele tău"
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {user?.firstname}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Nume</Label>
            {isEditing ? (
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Numele tău"
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {user?.lastname}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {user?.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Telefon</Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+40 (123) 456-789"
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {formData.phoneNumber || 'Nu este specificat'}
              </p>
            )}
          </div>
        </div>

        {/* Bio pentru Teacher */}
        {user?.role === 'Teacher' && (
          <div className="space-y-2">
            <Label htmlFor="bio">Despre mine</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Scrie o scurtă descriere despre experiența ta..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {formData.bio || 'Nu este specificat'}
              </p>
            )}
          </div>
        )}

        {/* Informații de Sistem (Read-only) */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Informații cont</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Rol</Label>
              <p className="mt-1">{getRoleLabel(user?.role || '')}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Ultima autentificare
              </Label>
              <p className="mt-1">
                {user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString('ro-RO')
                  : 'Nedeterminat'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Cont creat la
              </Label>
              <p className="mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString('ro-RO')
                  : 'Nedeterminat'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Ultima modificare
              </Label>
              <p className="mt-1">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleString('ro-RO')
                  : 'Nedeterminat'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
