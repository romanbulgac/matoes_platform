import { useState } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings, 
  GraduationCap,
  CreditCard,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Star,
  Target,
  TrendingUp,
  Award,
  Clock,
  MessageCircle,
  FileText,
  Shield,
  Database,
  Zap,
  X
} from 'lucide-react';

interface DrawerItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  children?: DrawerItem[];
}

interface PremiumDrawerProps {
  userRole: 'Parent' | 'Teacher' | 'Admin' | 'Student';
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function PremiumDrawer({ userRole, userName, userEmail, className }: PremiumDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getDrawerItems = (): DrawerItem[] => {
    switch (userRole) {
      case 'Parent':
        return [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: Home
          },
          {
            title: 'Copiii Mei',
            href: '/children',
            icon: Users,
            children: [
              { title: 'Toți Copiii', href: '/children' },
              { title: 'Adaugă Copil', href: '/children/add' },
              { title: 'Progresul Copiilor', href: '/children/progress' }
            ]
          },
          {
            title: 'Profesori',
            href: '/teachers',
            icon: GraduationCap,
            children: [
              { title: 'Caută Profesori', href: '/teachers' },
              { title: 'Profesori Favoriți', href: '/teachers/favorites' },
              { title: 'Recenzii', href: '/teachers/reviews' }
            ]
          },
          {
            title: 'Calendar',
            href: '/calendar',
            icon: Calendar,
            badge: '3'
          },
          {
            title: 'Pachete',
            href: '/packages',
            icon: CreditCard
          },
          {
            title: 'Rapoarte',
            href: '/reports',
            icon: BarChart3
          }
        ];

      case 'Teacher':
        return [
          {
            title: 'Dashboard',
            href: '/teacher/dashboard',
            icon: Home
          },
          {
            title: 'Elevii Mei',
            href: '/teacher/students',
            icon: Users,
            children: [
              { title: 'Toți Elevii', href: '/teacher/students' },
              { title: 'Grupuri', href: '/teacher/groups' },
              { title: 'Lecții Individuale', href: '/teacher/individual' }
            ]
          },
          {
            title: 'Programul Meu',
            href: '/teacher/schedule',
            icon: Calendar
          },
          {
            title: 'Profilul Meu',
            href: '/teacher/profile',
            icon: User
          },
          {
            title: 'Câștiguri',
            href: '/teacher/earnings',
            icon: CreditCard
          },
          {
            title: 'Materiale',
            href: '/teacher/materials',
            icon: BookOpen
          }
        ];

      case 'Admin':
        return [
          {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: Home
          },
          {
            title: 'Utilizatori',
            href: '/admin/users',
            icon: Users,
            badge: '12'
          },
          {
            title: 'Cereri Profesori',
            href: '/admin/applications',
            icon: FileText,
            badge: '5'
          },
          {
            title: 'Grupuri',
            href: '/admin/groups',
            icon: Users
          },
          {
            title: 'Analiză',
            href: '/admin/analytics',
            icon: BarChart3
          },
          {
            title: 'Setări',
            href: '/admin/settings',
            icon: Settings
          }
        ];

      case 'Student':
        return [
          {
            title: 'Dashboard',
            href: '/student/dashboard',
            icon: Home
          },
          {
            title: 'Lecțiile Mele',
            href: '/student/lessons',
            icon: BookOpen
          },
          {
            title: 'Progresul Meu',
            href: '/student/progress',
            icon: TrendingUp
          },
          {
            title: 'Profesorii Mei',
            href: '/student/teachers',
            icon: GraduationCap
          },
          {
            title: 'Materiale',
            href: '/student/materials',
            icon: BookOpen
          }
        ];

      default:
        return [];
    }
  };

  const drawerItems = getDrawerItems();

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const renderDrawerItem = (item: DrawerItem, level = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.has(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${
            level > 0 ? 'ml-4' : ''
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.title);
            } else {
              // Navigate to item.href
              setIsOpen(false);
            }
          }}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5" />}
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="destructive" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {item.children!.map((child) => (
              <div
                key={child.title}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm text-muted-foreground">{child.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Mateos Platform</DrawerTitle>
              <DrawerDescription>
                {userName && `${userName} • `}{userRole}
              </DrawerDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {drawerItems.map((item) => renderDrawerItem(item))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2 pb-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notificări</span>
              <Badge variant="destructive" className="text-xs">2</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Setări</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer text-destructive">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Deconectare</span>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
