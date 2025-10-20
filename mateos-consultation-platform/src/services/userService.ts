// Сервис для работы с пользователями
import { apiClient } from './api';
import { UserDto } from '../types/api';

export class UserService {
  // Получение профиля текущего пользователя
  static async getProfile(): Promise<UserDto> {
    const result = await apiClient.get<UserDto>('/users/profile');
    console.log('UserService.getProfile result:', result);
    return result;
  }

  // Обновление профиля пользователя
  static async updateProfile(userData: Partial<UserDto>): Promise<UserDto> {
    const result = await apiClient.put<UserDto>('/users/profile', userData);
    return result;
  }

  // Получение пользователя по ID
  static async getById(id: string): Promise<UserDto> {
    const result = await apiClient.get<UserDto>(`/users/${id}`);
    return result;
  }
}
