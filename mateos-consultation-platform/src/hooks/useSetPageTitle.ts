import { usePageTitle } from '@/hooks/usePageTitle';
import { useEffect } from 'react';

/**
 * Hook pentru setarea automată a titlului paginii
 * @param title - Titlul paginii de setat
 */
export const useSetPageTitle = (title: string) => {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);
};