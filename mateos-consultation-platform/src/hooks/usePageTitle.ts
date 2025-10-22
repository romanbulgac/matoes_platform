import { PageTitleContext } from '@/contexts/page-title-context';
import { useContext } from 'react';

// Hook pentru utilizarea contextului
export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
};