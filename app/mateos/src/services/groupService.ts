import { api } from './apiClient';
import { Group, CreateGroupData, GroupFilters, GroupMember } from '@/types';

export const groupService = {
  // Get all groups
  getAllGroups: async (filters?: GroupFilters): Promise<Group[]> => {
    const response = await api.get<Group[]>('/groups', { params: filters });
    return response.data;
  },

  // Get group by ID
  getGroupById: async (id: string): Promise<Group> => {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
  },

  // Create group
  createGroup: async (data: CreateGroupData): Promise<Group> => {
    const response = await api.post<Group>('/groups', data);
    return response.data;
  },

  // Update group
  updateGroup: async (id: string, data: Partial<CreateGroupData>): Promise<Group> => {
    const response = await api.put<Group>(`/groups/${id}`, data);
    return response.data;
  },

  // Delete group
  deleteGroup: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },

  // Add member
  addMember: async (groupId: string, studentId: string): Promise<GroupMember> => {
    const response = await api.post<GroupMember>(`/groups/${groupId}/members`, { studentId });
    return response.data;
  },

  // Remove member
  removeMember: async (groupId: string, studentId: string): Promise<void> => {
    await api.delete(`/groups/${groupId}/members/${studentId}`);
  },

  // Get group members
  getGroupMembers: async (groupId: string): Promise<GroupMember[]> => {
    const response = await api.get<GroupMember[]>(`/groups/${groupId}/members`);
    return response.data;
  },
};

