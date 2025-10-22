import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  category: string;
}

interface ResizableDashboardProps {
  userRole: 'Parent' | 'Teacher' | 'Admin' | 'Student';
  widgets: DashboardWidget[];
  className?: string;
}

export function ResizableDashboard({ userRole, widgets, className }: ResizableDashboardProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'focus' | 'compact'>('grid');
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const getDefaultSizes = () => {
    switch (layoutMode) {
      case 'focus':
        return [20, 60, 20]; // Sidebar, Main, Sidebar
      case 'compact':
        return [15, 70, 15];
      default:
        return [25, 50, 25]; // Grid mode
    }
  };

  const getWidgetsForPanel = (panel: 'left' | 'center' | 'right') => {
    switch (panel) {
      case 'left':
        return widgets.filter(w => w.category === 'navigation' || w.category === 'quick-actions');
      case 'center':
        return widgets.filter(w => w.category === 'main' || w.category === 'analytics');
      case 'right':
        return widgets.filter(w => w.category === 'notifications' || w.category === 'recent');
      default:
        return [];
    }
  };

  const renderWidget = (widget: DashboardWidget) => (
    <Card key={widget.id} className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{widget.title}</CardTitle>
            <CardDescription className="text-sm">{widget.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {widget.size}
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {widget.component}
      </CardContent>
    </Card>
  );

  const renderPanel = (panel: 'left' | 'center' | 'right') => {
    const panelWidgets = getWidgetsForPanel(panel);
    
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {panelWidgets.length > 0 ? (
            panelWidgets.map(renderWidget)
          ) : (
            <Card className="h-32 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-sm">Nu există widget-uri pentru această secțiune</div>
                <Button variant="outline" size="sm" className="mt-2">
                  Adaugă widget
                </Button>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className={`h-full ${className}`}>
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Dashboard {userRole}</h2>
          <Badge variant="secondary">Personalizabil</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={layoutMode} onValueChange={(value) => value && setLayoutMode(value as any)}>
            <ToggleGroupItem value="grid" aria-label="Grid Layout">
              <BarChart3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="focus" aria-label="Focus Layout">
              <Maximize2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="compact" aria-label="Compact Layout">
              <Minimize2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrează
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportă
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizează
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Layout
            </Button>
          </div>
        </div>
      </div>

      {/* Resizable Dashboard */}
      <ResizablePanelGroup
        direction="horizontal"
        className="h-[calc(100vh-80px)]"
        onLayout={(sizes) => {
          // Save layout preferences
          localStorage.setItem('dashboard-layout', JSON.stringify(sizes));
        }}
      >
        {/* Left Panel */}
        <ResizablePanel 
          defaultSize={getDefaultSizes()[0]} 
          minSize={15} 
          maxSize={40}
          className="border-r"
        >
          {renderPanel('left')}
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center Panel */}
        <ResizablePanel 
          defaultSize={getDefaultSizes()[1]} 
          minSize={30}
          className="border-r"
        >
          {renderPanel('center')}
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel */}
        <ResizablePanel 
          defaultSize={getDefaultSizes()[2]} 
          minSize={15} 
          maxSize={40}
        >
          {renderPanel('right')}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Layout Tips */}
      <div className="absolute bottom-4 right-4 bg-white border rounded-lg shadow-lg p-3 max-w-xs">
        <div className="text-sm text-gray-600">
          <div className="font-medium mb-1">💡 Sfat pentru layout:</div>
          <div className="text-xs">
            Trage marginile pentru a redimensiona panourile. 
            Layout-ul se salvează automat.
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample widget components
export function QuickStatsWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Lecții această săptămână</span>
        <span className="font-semibold">8</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Progres mediu</span>
        <span className="font-semibold text-green-600">87%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Următoarea lecție</span>
        <span className="font-semibold text-blue-600">În 2 ore</span>
      </div>
    </div>
  );
}

export function RecentActivityWidget() {
  const activities = [
    { id: 1, text: 'Lecție finalizată cu Prof. Popescu', time: '2 ore în urmă', type: 'success' },
    { id: 2, text: 'Temă nouă primită la Matematică', time: '4 ore în urmă', type: 'info' },
    { id: 3, text: 'Lecție programată pentru mâine', time: '1 zi în urmă', type: 'warning' },
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
          <div className={`w-2 h-2 rounded-full mt-2 ${
            activity.type === 'success' ? 'bg-green-500' :
            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">{activity.text}</div>
            <div className="text-xs text-gray-500">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarWidget() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">15</div>
        <div className="text-sm text-gray-600">Ianuarie 2025</div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <div className="text-sm">Matematică - 14:00</div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <div className="text-sm">Fizică - 16:00</div>
        </div>
      </div>
    </div>
  );
}
