import { SecurityActivityLog } from '@/components/security/SecurityActivityLog';
import { SecurityStats } from '@/components/security/SecurityStats';
import { SessionManager } from '@/components/security/SessionManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAlert } from '@/hooks/use-alert';
import { AuthService } from '@/services/authService';
import { Lock, Save } from 'lucide-react';
import { FC, useState } from 'react';

/**
 * SecurityTab - вкладка безопасности профиля
 * Управление паролем, сессиями и настройками безопасности
 */
export const SecurityTab: FC = () => {
  const { showSuccess, showError } = useAlert();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    // Валидация
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showError('Toate câmpurile sunt obligatorii');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Parolele noi nu coincid');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError('Parola trebuie să conțină cel puțin 8 caractere');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      showSuccess('Parola a fost schimbată cu succes');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error instanceof Error ? error.message : 'Eroare la schimbarea parolei';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Statistici Securitate */}
      <SecurityStats />

      <Separator />

      {/* Schimbare Parolă */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Schimbă parola</CardTitle>
              <CardDescription>
                Actualizează parola pentru a-ți proteja contul
              </CardDescription>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Schimbă parola
              </Button>
            )}
          </div>
        </CardHeader>

        {isChangingPassword && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Parola curentă</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Introdu parola curentă"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Parola nouă</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Introdu parola nouă"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractere
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmă parola nouă"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleCancelPasswordChange}
                disabled={isLoading}
              >
                Anulează
              </Button>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Se salvează...' : 'Salvează parola'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Session Manager */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiuni active</CardTitle>
          <CardDescription>
            Gestionează dispozitivele pe care ești autentificat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionManager />
        </CardContent>
      </Card>

      <Separator />

      {/* Jurnal Activitate Securitate */}
      <SecurityActivityLog />
    </div>
  );
};
