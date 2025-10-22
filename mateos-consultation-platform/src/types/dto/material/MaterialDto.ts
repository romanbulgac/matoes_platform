/**
 * DTO pentru materiale educaționale
 */
export interface MaterialDto {
  id: string;
  /** Titlul materialului */
  title: string;
  /** URI-ul resursei */
  resourceUri: string;
  /** Tipul fișierului */
  fileType: string;
  /** Descrierea opțională */
  description?: string;
  /** ID-ul profesorului */
  teacherId: string;
  /** ID-ul consultației (opțional) */
  consultationId?: string;
  /** Data creării */
  createdAt: string;
  /** Data actualizării */
  updatedAt: string;
}