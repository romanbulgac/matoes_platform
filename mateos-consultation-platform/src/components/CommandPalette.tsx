import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, Command } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { 
  Search, 
  User, 
  Calendar, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Users, 
  GraduationCap,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  UserPlus,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share,
  Archive,
  Star,
  Target,
  Award,
  Zap,
  FileText
} from 'lucide-react';

interface CommandPaletteProps {
  userRole?: string;
}

interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  keywords: string[];
  action: () => void;
  category: string;
  badge?: string;
  shortcut?: string;
}

export function CommandPalette({ userRole = 'Parent' }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Define actions based on user role
  const getActions = (): CommandAction[] => {
    const baseActions: CommandAction[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Vezi panoul principal',
        icon: BarChart3,
        keywords: ['dashboard', 'panou', 'principal'],
        action: () => navigate('/dashboard'),
        category: 'Navigare'
      },
      {
        id: 'profile',
        title: 'Profil',
        description: 'Editează profilul tău',
        icon: User,
        keywords: ['profil', 'profile', 'editare'],
        action: () => navigate('/profile'),
        category: 'Navigare'
      },
      {
        id: 'settings',
        title: 'Setări',
        description: 'Configurează aplicația',
        icon: Settings,
        keywords: ['setări', 'settings', 'configurare'],
        action: () => navigate('/settings'),
        category: 'Navigare'
      },
      {
        id: 'notifications',
        title: 'Notificări',
        description: 'Vezi notificările',
        icon: Bell,
        keywords: ['notificări', 'notifications', 'alerts'],
        action: () => console.log('Open notifications'),
        category: 'Acțiuni Rapide',
        badge: '3'
      },
      {
        id: 'help',
        title: 'Ajutor',
        description: 'Găsește ajutor și suport',
        icon: HelpCircle,
        keywords: ['ajutor', 'help', 'suport', 'support'],
        action: () => navigate('/help'),
        category: 'Acțiuni Rapide'
      },
      {
        id: 'logout',
        title: 'Deconectare',
        description: 'Ieși din cont',
        icon: LogOut,
        keywords: ['logout', 'deconectare', 'ieșire'],
        action: () => console.log('Logout'),
        category: 'Acțiuni Rapide'
      }
    ];

    if (userRole === 'Parent') {
      return [
        ...baseActions,
        {
          id: 'invite-child',
          title: 'Invită Copil',
          description: 'Generează link de invitație pentru copil',
          icon: UserPlus,
          keywords: ['invită', 'copil', 'child', 'invite'],
          action: () => navigate('/invite-child'),
          category: 'Acțiuni Rapide'
        },
        {
          id: 'buy-package',
          title: 'Cumpără Pachet',
          description: 'Achiziționează lecții noi',
          icon: CreditCard,
          keywords: ['cumpără', 'pachet', 'buy', 'package', 'lecții'],
          action: () => navigate('/packages'),
          category: 'Acțiuni Rapide'
        },
        {
          id: 'children',
          title: 'Copiii Mei',
          description: 'Gestionează profilurile copiilor',
          icon: Users,
          keywords: ['copii', 'children', 'kids', 'elevi'],
          action: () => navigate('/children'),
          category: 'Navigare'
        },
        {
          id: 'teachers',
          title: 'Profesori',
          description: 'Găsește profesori pentru copii',
          icon: GraduationCap,
          keywords: ['profesori', 'teachers', 'profesori'],
          action: () => navigate('/teachers'),
          category: 'Navigare'
        },
        {
          id: 'calendar',
          title: 'Calendar',
          description: 'Vezi programul lecțiilor',
          icon: Calendar,
          keywords: ['calendar', 'program', 'lecții', 'schedule'],
          action: () => navigate('/calendar'),
          category: 'Navigare',
          badge: '5'
        }
      ];
    }

    if (userRole === 'Teacher') {
      return [
        ...baseActions,
        {
          id: 'students',
          title: 'Elevii Mei',
          description: 'Gestionează elevii',
          icon: Users,
          keywords: ['elevi', 'students', 'elevii'],
          action: () => navigate('/teacher/students'),
          category: 'Navigare'
        },
        {
          id: 'schedule',
          title: 'Programul Meu',
          description: 'Gestionează disponibilitatea',
          icon: Calendar,
          keywords: ['program', 'schedule', 'disponibilitate'],
          action: () => navigate('/teacher/schedule'),
          category: 'Navigare'
        },
        {
          id: 'materials',
          title: 'Materiale',
          description: 'Gestionează materialele',
          icon: BookOpen,
          keywords: ['materiale', 'materials', 'resurse'],
          action: () => navigate('/teacher/materials'),
          category: 'Navigare'
        },
        {
          id: 'earnings',
          title: 'Câștiguri',
          description: 'Vezi câștigurile',
          icon: CreditCard,
          keywords: ['câștiguri', 'earnings', 'bani', 'money'],
          action: () => navigate('/teacher/earnings'),
          category: 'Navigare'
        }
      ];
    }

    if (userRole === 'Student') {
      return [
        ...baseActions,
        {
          id: 'lessons',
          title: 'Lecțiile Mele',
          description: 'Vezi lecțiile programate',
          icon: BookOpen,
          keywords: ['lecții', 'lessons', 'cursuri'],
          action: () => navigate('/student/lessons'),
          category: 'Navigare',
          badge: '3'
        },
        {
          id: 'progress',
          title: 'Progresul Meu',
          description: 'Vezi progresul în învățare',
          icon: Target,
          keywords: ['progres', 'progress', 'evoluție'],
          action: () => navigate('/student/progress'),
          category: 'Navigare'
        },
        {
          id: 'teachers',
          title: 'Profesorii Mei',
          description: 'Vezi profesorii',
          icon: GraduationCap,
          keywords: ['profesori', 'teachers', 'profesori'],
          action: () => navigate('/student/teachers'),
          category: 'Navigare'
        },
        {
          id: 'materials',
          title: 'Materiale',
          description: 'Accesează materialele',
          icon: BookOpen,
          keywords: ['materiale', 'materials', 'resurse'],
          action: () => navigate('/student/materials'),
          category: 'Navigare'
        }
      ];
    }

    if (userRole === 'Admin') {
      return [
        ...baseActions,
        {
          id: 'users',
          title: 'Utilizatori',
          description: 'Gestionează utilizatorii',
          icon: Users,
          keywords: ['utilizatori', 'users', 'gestionare'],
          action: () => navigate('/admin/users'),
          category: 'Administrare',
          badge: '12'
        },
        {
          id: 'applications',
          title: 'Cereri Profesori',
          description: 'Aprobă cereri profesori',
          icon: FileText,
          keywords: ['cereri', 'applications', 'profesori'],
          action: () => navigate('/admin/applications'),
          category: 'Administrare',
          badge: '5'
        },
        {
          id: 'analytics',
          title: 'Analiză',
          description: 'Statistici platformă',
          icon: BarChart3,
          keywords: ['analiză', 'analytics', 'statistici'],
          action: () => navigate('/admin/analytics'),
          category: 'Administrare'
        },
        {
          id: 'groups',
          title: 'Grupuri',
          description: 'Gestionează grupuri',
          icon: Users,
          keywords: ['grupuri', 'groups', 'clase'],
          action: () => navigate('/admin/groups'),
          category: 'Administrare'
        }
      ];
    }

    return baseActions;
  };

  const actions = getActions();

  // Group actions by category
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  // Filter actions based on search
  const filteredActions = Object.entries(groupedActions).map(([category, categoryActions]) => [
    category,
    categoryActions.filter(action => 
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
    )
  ]).filter(([_, categoryActions]) => categoryActions.length > 0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        <CommandInput 
          placeholder="Caută acțiuni, pagini sau comenzi..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>Nu s-au găsit rezultate.</CommandEmpty>
          
          {filteredActions.map(([category, categoryActions], index) => (
            <div key={category as string}>
              <CommandGroup heading={category as string}>
                {(categoryActions as CommandAction[]).map((action) => {
                  const Icon = action.icon;
                  return (
                    <CommandItem
                      key={action.id}
                      onSelect={() => {
                        action.action();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                      {action.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {action.badge}
                        </Badge>
                      )}
                      {action.shortcut && (
                        <KbdGroup className="ml-auto">
                          {action.shortcut.split('+').map((key: string, i: number) => (
                            <Kbd key={i}>{key}</Kbd>
                          ))}
                        </KbdGroup>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {index < filteredActions.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
        
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <span>pentru a deschide</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>pentru navigare</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span>pentru selectare</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {actions.length} acțiuni disponibile
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}