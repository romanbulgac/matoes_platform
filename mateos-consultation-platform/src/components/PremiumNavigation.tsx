import { useState } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings, 
  GraduationCap,
  CreditCard,
  Bell,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Star,
  Target,
  TrendingUp,
  Award,
  Clock,
  MessageCircle,
  FileText,
  Shield,
  Database,
  Zap
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  children?: NavigationItem[];
}

interface PremiumNavigationProps {
  userRole: 'Parent' | 'Teacher' | 'Admin' | 'Student';
  className?: string;
}

export function PremiumNavigation({ userRole, className }: PremiumNavigationProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const getNavigationItems = (): NavigationItem[] => {
    switch (userRole) {
      case 'Parent':
        return [
          {
            title: 'Dashboard',
            href: '/dashboard',
            description: 'Panoul principal cu statistici',
            icon: Home
          },
          {
            title: 'Copiii Mei',
            href: '/children',
            description: 'Gestionează profilurile copiilor',
            icon: Users,
            children: [
              {
                title: 'Toți Copiii',
                href: '/children',
                description: 'Vezi toți copiii'
              },
              {
                title: 'Adaugă Copil',
                href: '/children/add',
                description: 'Invită un copil nou'
              },
              {
                title: 'Progresul Copiilor',
                href: '/children/progress',
                description: 'Vezi progresul în detaliu'
              }
            ]
          },
          {
            title: 'Profesori',
            href: '/teachers',
            description: 'Găsește profesori pentru copii',
            icon: GraduationCap,
            children: [
              {
                title: 'Caută Profesori',
                href: '/teachers',
                description: 'Explorează profesori disponibili'
              },
              {
                title: 'Profesori Favoriți',
                href: '/teachers/favorites',
                description: 'Profesori salvați'
              },
              {
                title: 'Recenzii',
                href: '/teachers/reviews',
                description: 'Lasă recenzii pentru profesori'
              }
            ]
          },
          {
            title: 'Calendar',
            href: '/calendar',
            description: 'Programul lecțiilor',
            icon: Calendar,
            badge: '3',
            children: [
              {
                title: 'Calendar Principal',
                href: '/calendar',
                description: 'Vezi toate lecțiile'
              },
              {
                title: 'Programează Lecție',
                href: '/calendar/schedule',
                description: 'Programează o lecție nouă'
              },
              {
                title: 'Istoric Lecții',
                href: '/calendar/history',
                description: 'Lecții finalizate'
              }
            ]
          },
          {
            title: 'Pachete',
            href: '/packages',
            description: 'Gestionează abonamentele',
            icon: CreditCard,
            children: [
              {
                title: 'Pachete Active',
                href: '/packages',
                description: 'Vezi pachetele curente'
              },
              {
                title: 'Cumpără Pachet',
                href: '/packages/buy',
                description: 'Achiziționează lecții noi'
              },
              {
                title: 'Istoric Plăți',
                href: '/packages/history',
                description: 'Vezi toate plățile'
              }
            ]
          },
          {
            title: 'Rapoarte',
            href: '/reports',
            description: 'Analizează progresul',
            icon: BarChart3,
            children: [
              {
                title: 'Progres General',
                href: '/reports/progress',
                description: 'Progresul în toate materiile'
              },
              {
                title: 'Performanță',
                href: '/reports/performance',
                description: 'Analiză performanță'
              },
              {
                title: 'Export Date',
                href: '/reports/export',
                description: 'Descarcă rapoarte'
              }
            ]
          }
        ];

      case 'Teacher':
        return [
          {
            title: 'Dashboard',
            href: '/teacher/dashboard',
            description: 'Panoul principal profesor',
            icon: Home
          },
          {
            title: 'Elevii Mei',
            href: '/teacher/students',
            description: 'Gestionează elevii',
            icon: Users,
            children: [
              {
                title: 'Toți Elevii',
                href: '/teacher/students',
                description: 'Vezi toți elevii'
              },
              {
                title: 'Grupuri',
                href: '/teacher/groups',
                description: 'Gestionează grupuri'
              },
              {
                title: 'Lecții Individuale',
                href: '/teacher/individual',
                description: 'Elevi cu lecții individuale'
              }
            ]
          },
          {
            title: 'Programul Meu',
            href: '/teacher/schedule',
            description: 'Gestionează disponibilitatea',
            icon: Calendar,
            children: [
              {
                title: 'Calendar Disponibilitate',
                href: '/teacher/schedule',
                description: 'Setare disponibilitate'
              },
              {
                title: 'Lecții Programate',
                href: '/teacher/lessons',
                description: 'Lecții viitoare'
              },
              {
                title: 'Istoric Lecții',
                href: '/teacher/history',
                description: 'Lecții finalizate'
              }
            ]
          },
          {
            title: 'Profilul Meu',
            href: '/teacher/profile',
            description: 'Gestionează profilul public',
            icon: User,
            children: [
              {
                title: 'Profil Public',
                href: '/teacher/profile',
                description: 'Editează profilul'
              },
              {
                title: 'Certificări',
                href: '/teacher/certifications',
                description: 'Adaugă certificări'
              },
              {
                title: 'Recenzii',
                href: '/teacher/reviews',
                description: 'Vezi recenziile'
              }
            ]
          },
          {
            title: 'Câștiguri',
            href: '/teacher/earnings',
            description: 'Vezi câștigurile',
            icon: CreditCard,
            children: [
              {
                title: 'Câștiguri Lunare',
                href: '/teacher/earnings',
                description: 'Vezi câștigurile'
              },
              {
                title: 'Istoric Plăți',
                href: '/teacher/payments',
                description: 'Istoric plăți'
              },
              {
                title: 'Setări Plată',
                href: '/teacher/payment-settings',
                description: 'Configurează plățile'
              }
            ]
          },
          {
            title: 'Materiale',
            href: '/teacher/materials',
            description: 'Gestionează materialele',
            icon: BookOpen,
            children: [
              {
                title: 'Materiale Mele',
                href: '/teacher/materials',
                description: 'Vezi materialele'
              },
              {
                title: 'Adaugă Material',
                href: '/teacher/materials/add',
                description: 'Încarcă material nou'
              },
              {
                title: 'Bibliotecă',
                href: '/teacher/materials/library',
                description: 'Materiale partajate'
              }
            ]
          }
        ];

      case 'Admin':
        return [
          {
            title: 'Dashboard',
            href: '/admin/dashboard',
            description: 'Panoul de administrare',
            icon: Home
          },
          {
            title: 'Utilizatori',
            href: '/admin/users',
            description: 'Gestionează utilizatorii',
            icon: Users,
            badge: '12',
            children: [
              {
                title: 'Toți Utilizatorii',
                href: '/admin/users',
                description: 'Vezi toți utilizatorii'
              },
              {
                title: 'Profesori',
                href: '/admin/teachers',
                description: 'Gestionează profesori'
              },
              {
                title: 'Părinți',
                href: '/admin/parents',
                description: 'Gestionează părinți'
              },
              {
                title: 'Elevi',
                href: '/admin/students',
                description: 'Gestionează elevi'
              }
            ]
          },
          {
            title: 'Cereri Profesori',
            href: '/admin/applications',
            description: 'Aprobă cereri profesori',
            icon: FileText,
            badge: '5',
            children: [
              {
                title: 'Cereri Noi',
                href: '/admin/applications',
                description: 'Cereri în așteptare'
              },
              {
                title: 'Cereri Aprobate',
                href: '/admin/applications/approved',
                description: 'Cereri aprobate'
              },
              {
                title: 'Cereri Respinse',
                href: '/admin/applications/rejected',
                description: 'Cereri respinse'
              }
            ]
          },
          {
            title: 'Grupuri',
            href: '/admin/groups',
            description: 'Gestionează grupuri',
            icon: Users,
            children: [
              {
                title: 'Toate Grupurile',
                href: '/admin/groups',
                description: 'Vezi toate grupurile'
              },
              {
                title: 'Creează Grup',
                href: '/admin/groups/create',
                description: 'Creează grup nou'
              },
              {
                title: 'Analiză Grupuri',
                href: '/admin/groups/analytics',
                description: 'Statistici grupuri'
              }
            ]
          },
          {
            title: 'Analiză',
            href: '/admin/analytics',
            description: 'Statistici platformă',
            icon: BarChart3,
            children: [
              {
                title: 'Statistici Generale',
                href: '/admin/analytics',
                description: 'Vezi statisticile'
              },
              {
                title: 'Rapoarte',
                href: '/admin/reports',
                description: 'Generează rapoarte'
              },
              {
                title: 'Export Date',
                href: '/admin/export',
                description: 'Exportă datele'
              }
            ]
          },
          {
            title: 'Setări',
            href: '/admin/settings',
            description: 'Configurează platforma',
            icon: Settings,
            children: [
              {
                title: 'Setări Platformă',
                href: '/admin/settings',
                description: 'Configurare generală'
              },
              {
                title: 'Tarife',
                href: '/admin/settings/pricing',
                description: 'Gestionează tarifele'
              },
              {
                title: 'Securitate',
                href: '/admin/settings/security',
                description: 'Setări securitate'
              }
            ]
          }
        ];

      case 'Student':
        return [
          {
            title: 'Dashboard',
            href: '/student/dashboard',
            description: 'Panoul principal elev',
            icon: Home
          },
          {
            title: 'Lecțiile Mele',
            href: '/student/lessons',
            description: 'Vezi lecțiile',
            icon: BookOpen,
            children: [
              {
                title: 'Lecții Viitoare',
                href: '/student/lessons',
                description: 'Lecții programate'
              },
              {
                title: 'Lecții Finalizate',
                href: '/student/lessons/completed',
                description: 'Istoric lecții'
              },
              {
                title: 'Teme',
                href: '/student/homework',
                description: 'Teme și exerciții'
              }
            ]
          },
          {
            title: 'Progresul Meu',
            href: '/student/progress',
            description: 'Vezi progresul',
            icon: TrendingUp,
            children: [
              {
                title: 'Progres General',
                href: '/student/progress',
                description: 'Progres în toate materiile'
              },
              {
                title: 'Realizări',
                href: '/student/achievements',
                description: 'Badge-uri și realizări'
              },
              {
                title: 'Statistici',
                href: '/student/stats',
                description: 'Statistici detaliate'
              }
            ]
          },
          {
            title: 'Profesorii Mei',
            href: '/student/teachers',
            description: 'Vezi profesorii',
            icon: GraduationCap,
            children: [
              {
                title: 'Profesori Activi',
                href: '/student/teachers',
                description: 'Profesori curenți'
              },
              {
                title: 'Recenzii',
                href: '/student/reviews',
                description: 'Lasă recenzii'
              },
              {
                title: 'Mesaje',
                href: '/student/messages',
                description: 'Conversații cu profesori'
              }
            ]
          },
          {
            title: 'Materiale',
            href: '/student/materials',
            description: 'Accesează materialele',
            icon: BookOpen,
            children: [
              {
                title: 'Materiale Recente',
                href: '/student/materials',
                description: 'Materiale noi'
              },
              {
                title: 'Bibliotecă',
                href: '/student/materials/library',
                description: 'Toate materialele'
              },
              {
                title: 'Favoriți',
                href: '/student/materials/favorites',
                description: 'Materiale salvate'
              }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const renderNavigationItem = (item: NavigationItem) => {
    const Icon = item.icon;

    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </NavigationMenuTrigger>
        {item.children && (
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[500px]">
              {item.children.map((child) => (
                <NavigationMenuLink
                  key={child.title}
                  href={child.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">{child.title}</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {child.description}
                  </p>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        )}
      </NavigationMenuItem>
    );
  };

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {navigationItems.map(renderNavigationItem)}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
