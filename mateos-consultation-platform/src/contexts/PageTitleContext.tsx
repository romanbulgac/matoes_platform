import { ReactNode, useState } from 'react';
import { PageTitleContext } from './page-title-context';

interface PageTitleProviderProps {
  children: ReactNode;
}

// Provider component
export function PageTitleProvider({ children }: PageTitleProviderProps) {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}