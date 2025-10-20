import { createContext } from 'react';

export interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);