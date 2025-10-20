// Конверторы между API типами и внутренними типами приложения

import { User, UserRole } from '@/types';
import { UserDto } from '@/types/api';

// Конвертер UserDto в User
// ✅ UPDATED: Now expects camelCase fields (auto-transformed by ApiClient)
export function convertUserDtoToUser(userDto: UserDto): User {
  console.log('Converting UserDto to User:', userDto);
  
  const convertedUser = {
    id: userDto.id,
    email: userDto.email,
    firstname: userDto.name,
    lastname: userDto.surname,
    role: userDto.role as UserRole,
    lastLoginAt: userDto.lastLogin,
    profile: {
      firstname: userDto.name,
      lastname: userDto.surname,
      avatar: userDto.profilePicture,
      phone: userDto.phoneNumber,
      timezone: 'Europe/Bucharest',
      preferences: {
        theme: 'system' as const,
        language: 'ro',
        notifications: {
          email: true,
          push: true,
          sms: false,
          consultationReminders: true,
          paymentReminders: true,
        }
      }
    },
    createdAt: userDto.createdAt || new Date().toISOString(),
    updatedAt: userDto.updatedAt || new Date().toISOString(),
  };
  
  console.log('Converted User:', convertedUser);
  return convertedUser;
}

// Конвертер User в UserDto (если нужно)
// ✅ UPDATED: Now returns camelCase fields
export function convertUserToUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.firstname,
    surname: user.lastname,
    role: user.role,
    userType: user.role,
    isActive: true,
    lastLogin: user.lastLoginAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
