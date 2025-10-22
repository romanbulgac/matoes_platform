// Export all types
export * from './user';
export * from './subscription';
export * from './consultation';
export * from './teacher';
export * from './family';
export * from './group';
export * from './notification';
export * from './material';

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

