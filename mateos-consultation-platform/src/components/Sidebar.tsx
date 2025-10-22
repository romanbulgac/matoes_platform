import {
    CalendarDays,
    Crown,
    GraduationCap,
    House,
    Library,
    TrendingUp,
    User,
    UserCog,
    UsersRound,
    Wallet
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    Sidebar as SidebarPrimitive,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useHoverAnimation, useSlideIn, useStaggerAnimation } from '@/hooks/useGsap';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: typeof House;
  label: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: House,
    label: 'Acasă',
  },
  {
    to: '/consultations',
    icon: CalendarDays,
    label: 'Consultări',
  },
  {
    to: '/materials',
    icon: Library,
    label: 'Materiale',
    roles: ['Teacher', 'Student'],
  },
  {
    to: '/students',
    icon: GraduationCap,
    label: 'Studenți',
    roles: ['Teacher', 'Administrator'],
  },
  {
    to: '/teachers',
    icon: UserCog,
    label: 'Profesori',
    roles: ['Administrator'],
  },
  {
    to: '/users',
    icon: UsersRound,
    label: 'Utilizatori',
    roles: ['Administrator'],
  },
  {
    to: '/payments',
    icon: Wallet,
    label: 'Plăți',
  },
  {
    to: '/reports',
    icon: TrendingUp,
    label: 'Rapoarte',
    roles: ['Administrator', 'Teacher'],
  },
];

export function Sidebar({ className, ...props }: React.ComponentProps<typeof SidebarPrimitive>) {
  const { user } = useAuth();

  // Animații GSAP
  const sidebarRef = useSlideIn<HTMLDivElement>('left', [], { duration: 0.7 });
  const logoRef = useHoverAnimation<HTMLDivElement>({ scale: 1.02 });
  const navRef = useStaggerAnimation<HTMLUListElement>([], { stagger: 0.1, delay: 0.3 });

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  // Progres pentru studenți
  const consultationsUsed = 3;
  const consultationsTotal = 5;
  const progressPercentage = (consultationsUsed / consultationsTotal) * 100;

  return (
    <SidebarPrimitive
      ref={sidebarRef}
      className={cn("bg-sidebar border-sidebar-border", className)}
      {...props}
    >
      {/* Header cu Logo */}
      <SidebarHeader className="px-6 py-4 border-b border-sidebar-border">
        <div ref={logoRef} className="flex items-center space-x-3">
          <Logo size="md" variant="rounded" />
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Mateos
            </span>
            <p className="text-xs text-sidebar-accent-foreground font-medium">
              Platforma de meditații
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Conținut principal */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu ref={navRef}>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 transition-all duration-200",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Plan pentru studenți */}
        {user?.role === 'Student' && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200 mx-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Crown className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">Plan Bazic</h4>
                      <span className="text-xs text-primary-600 font-medium">
                        {consultationsUsed}/{consultationsTotal}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Consultații pe lună
                    </p>
                    <Progress 
                      value={progressPercentage} 
                      className="mt-2 h-2"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full mt-3 text-xs border-primary-200 text-primary-700 hover:bg-primary-50"
                    >
                      Îmbunătățește planul
                    </Button>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 transition-all duration-200",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )
                }
              >
                <User className="w-5 h-5" />
                <span>Profil</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}


