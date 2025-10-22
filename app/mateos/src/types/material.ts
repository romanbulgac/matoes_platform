export enum MaterialType {
  DOCUMENT = 'Document',
  VIDEO = 'Video',
  PRESENTATION = 'Presentation',
  EXERCISE = 'Exercise',
  OTHER = 'Other',
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  subject: string;
  gradeLevel: string;
  uploadedBy: string;
  uploaderName: string;
  fileUrl: string;
  fileSize: number;
  fileName: string;
  thumbnailUrl?: string;
  downloads: number;
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialFilters {
  subject?: string;
  gradeLevel?: string;
  type?: MaterialType;
  uploadedBy?: string;
  searchQuery?: string;
}

