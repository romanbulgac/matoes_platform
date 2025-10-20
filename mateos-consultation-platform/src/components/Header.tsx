import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Typography } from '@/components/ui/typography-bundle';
import { useAuth } from '@/contexts/AuthContext';
import { useFadeIn, useHoverAnimation } from '@/hooks/useGsap';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LogOut, Settings2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { NotificationBell, NotificationCenter } from './NotificationCenter';

export function Header() {
  const { user, logout } = useAuth();
  const { pageTitle } = usePageTitle();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Анимации
  const headerRef = useFadeIn<HTMLElement>([], { y: -20, duration: 0.6 });
  const logoRef = useHoverAnimation<HTMLDivElement>({ scale: 1.02 });

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header 
        ref={headerRef} 
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm"
      >
        <div className="flex items-center justify-between mx-14 ">
          {/* Logo și titlul paginii */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Typography.H3 className="text-gray-800 font-semibold">
                {pageTitle}
              </Typography.H3>
            </div>
          </div>

          {/* Partea dreaptă */}
          <div className="flex items-center space-x-4">
            {/* Уведомления */}
            <NotificationBell onClick={() => setShowNotifications(true)} />

            {/* Профиль пользователя */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary-200 hover:border-primary-400 transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-semibold">
                      {user && user.firstname && user.lastname 
                        ? `${user.firstname[0]}${user.lastname[0]}` 
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      {user ? `${user.firstname} ${user.lastname}` : 'Utilizator'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user?.role === 'Teacher' 
                          ? 'bg-blue-100 text-blue-800'
                          : user?.role === 'Student'
                          ? 'bg-green-100 text-green-800'
                          : user?.role === 'Administrator'
                          ? 'bg-purple-100 text-purple-800'
                          : user?.role === 'Parent'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user?.role === 'Student' ? 'Student' :
                         user?.role === 'Teacher' ? 'Profesor' :
                         user?.role === 'Administrator' ? 'Administrator' :
                         user?.role === 'Parent' ? 'Părinte' : 'Utilizator'}
                      </span>
                    </div>
                    {user?.email && (
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span>Setări</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Ieșire</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Модальное окно уведомлений */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
