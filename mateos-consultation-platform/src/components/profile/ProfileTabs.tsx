import { FC, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, CreditCard } from 'lucide-react';
import { GeneralInfoTab } from './tabs/GeneralInfoTab';
import { SecurityTab } from './tabs/SecurityTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProfileTabs Component
 * Централизованный компонент профиля с вкладками для разных ролей
 * 
 * Вкладки:
 * - Общая информация (для всех)
 * - Безопасность (для всех)
 * - Подписки (только для Parent)
 */
export const ProfileTabs: FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('general');
  
  const isParent = user?.role === 'Parent';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Informații generale
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Securitate
        </TabsTrigger>
        {isParent && (
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Abonamente
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <GeneralInfoTab />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecurityTab />
      </TabsContent>

      {isParent && (
        <TabsContent value="subscriptions" className="mt-6">
          <SubscriptionsTab />
        </TabsContent>
      )}
    </Tabs>
  );
};
