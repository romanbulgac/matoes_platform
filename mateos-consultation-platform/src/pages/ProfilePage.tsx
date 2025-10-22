import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ProfilePage() {
  useSetPageTitle('Profil');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 h-32 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>
          <div className="px-8 pb-8 -mt-16">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-2xl flex items-center justify-center border-4 border-white">
                  <User className="w-14 h-14 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full border-4 border-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 mt-12">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user?.firstname} {user?.lastname}
                    </h1>
                    <p className="text-gray-600 mb-3">
                      {user?.email}
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-gradient-to-r from-primary-600 to-purple-600 text-white border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {user?.role}
                      </Badge>
                      <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Cont Verificat
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Tabs */}
        <ProfileTabs />
      </div>
    </div>
  );
}
