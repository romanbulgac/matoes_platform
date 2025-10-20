import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export function ProfilePage() {
  useSetPageTitle('Profil');

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-600 mt-1">
            Gestionează contul și setările tale
          </p>
        </div>
      </div>

      <ProfileTabs />
    </div>
  );
}
