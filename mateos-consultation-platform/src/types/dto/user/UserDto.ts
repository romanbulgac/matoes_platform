/**
 * DTO pentru utilizatori
 */
export interface UserDto {
  id: string;
  /** Adresa de email a utilizatorului */
  email: string;
  /** Numele utilizatorului / Prenumele */
  name: string;
  /** Numele de familie */
  surname: string;
  /** Rolul utilizatorului (Student, Teacher, Administrator) */
  role: string;
  /** Tipul utilizatorului */
  userType?: string;
  /** Utilizatorul este activ */
  isActive: boolean;
  /** Imaginea de profil */
  profilePicture?: string;
  /** Numărul de telefon */
  phoneNumber?: string;
  /** Ultima conectare */
  lastLogin: string;
  /** Data creării */
  createdAt: string;
  /** Data ultimei actualizări */
  updatedAt?: string;
}