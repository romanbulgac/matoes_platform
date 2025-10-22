import { User, UserRole } from '@/types';

/**
 * Convertește UserDto (de la backend) în User (folosit în frontend)
 * Suportă atât PascalCase (backend) cât și camelCase
 */
export function convertUserDtoToUser(userDto: any): User {
  const phone = userDto.PhoneNumber || userDto.phoneNumber || userDto.phone || '';
  
  return {
    id: userDto.Id || userDto.id || '',
    firstname: userDto.Firstname || userDto.firstname || userDto.Name || userDto.name || '',
    lastname: userDto.Lastname || userDto.lastname || userDto.Surname || userDto.surname || '',
    email: userDto.Email || userDto.email || '',
    role: (userDto.Role || userDto.role) as UserRole || 'Student',
    lastLoginAt: userDto.LastLoginAt || userDto.lastLoginAt,
    profile: {
      firstname: userDto.Firstname || userDto.firstname || userDto.Name || userDto.name || '',
      lastname: userDto.Lastname || userDto.lastname || userDto.Surname || userDto.surname || '',
      phone: phone,
      timezone: 'Europe/Bucharest',
      preferences: {
        theme: 'system' as const,
        language: 'ro',
        notifications: {
          email: true,
          push: false,
          sms: false,
          consultationReminders: true,
          paymentReminders: true,
        },
      },
    },
    createdAt: userDto.CreatedAt || userDto.createdAt || new Date().toISOString(),
    updatedAt: userDto.UpdatedAt || userDto.updatedAt || new Date().toISOString(),
  };
}

