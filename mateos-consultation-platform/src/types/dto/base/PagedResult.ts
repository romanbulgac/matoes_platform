/**
 * DTO pentru parametrii de paginare
 */
export interface PaginationDto {
  /** Numărul paginii (bazat pe 1) */
  page: number;
  /** Numărul de elemente per pagină */
  pageSize: number;
  /** Câmpul de sortare opțional */
  sortBy?: string;
  /** Direcția de sortare (asc/desc) */
  sortDirection?: 'asc' | 'desc';
  /** Interogare de căutare opțională */
  search?: string;
}

/**
 * Container generic pentru rezultate paginate
 */
export interface PagedResult<T> {
  /** Colecția de elemente pentru pagina curentă */
  items: T[];
  /** Numărul paginii curente (bazat pe 1) */
  currentPage: number;
  /** Alias pentru currentPage */
  page: number;
  /** Numărul de elemente per pagină */
  pageSize: number;
  /** Numărul total de elemente din toate paginile */
  totalCount: number;
  /** Numărul total de pagini */
  totalPages: number;
  /** Dacă există o pagină anterioară */
  hasPrevious: boolean;
  /** Dacă există o pagină următoare */
  hasNext: boolean;
  /** Câmpul de sortare aplicat */
  sortBy?: string;
  /** Direcția de sortare aplicată */
  sortDirection?: string;
  /** Interogarea de căutare aplicată */
  search?: string;
}

/** Constante pentru paginare */
export const PAGINATION_CONSTANTS = {
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 10,
} as const;