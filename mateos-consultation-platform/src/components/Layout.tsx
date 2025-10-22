import { SidebarProvider } from '@/components/ui/sidebar';
import { useFadeIn } from '@/hooks/useGsap';
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const mainRef = useFadeIn<HTMLDivElement>([], { y: 8, duration: 0.35 });
  
  return (
    <SidebarProvider 
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-mobile": "18rem",
      } as React.CSSProperties}
      className="!h-screen !min-h-screen overflow-hidden"
    >
      <Sidebar collapsible="offcanvas" />
      
      <main className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Фиксированный Header */}
        <div className="flex-shrink-0">
          <Header />
        </div>
        
        {/* Прокручиваемый контент */}
        <div ref={mainRef} className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
