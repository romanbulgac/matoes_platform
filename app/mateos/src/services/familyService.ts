import { api } from './apiClient';
import { Child, ChildInvitation, CreateInvitationData, AcceptInvitationData } from '@/types';

export const familyService = {
  // Create child invitation
  createChildInvitation: async (data: CreateInvitationData): Promise<ChildInvitation> => {
    const response = await api.post<ChildInvitation>('/family/invitations', data);
    return response.data;
  },

  // Get invitation info
  getInvitationInfo: async (token: string): Promise<ChildInvitation> => {
    const response = await api.get<ChildInvitation>(`/family/invitations/${token}`);
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (data: AcceptInvitationData): Promise<Child> => {
    const response = await api.post<Child>('/family/invitations/accept', data);
    return response.data;
  },

  // Get all invitations
  getInvitations: async (): Promise<ChildInvitation[]> => {
    const response = await api.get<ChildInvitation[]>('/family/invitations');
    return response.data;
  },

  // Revoke invitation
  revokeInvitation: async (token: string): Promise<void> => {
    await api.delete(`/family/invitations/${token}`);
  },

  // Get children
  getChildren: async (): Promise<Child[]> => {
    const response = await api.get<Child[]>('/family/children');
    return response.data;
  },

  // Get child details
  getChildDetails: async (childId: string): Promise<Child> => {
    const response = await api.get<Child>(`/family/children/${childId}`);
    return response.data;
  },

  // Update child
  updateChild: async (childId: string, data: Partial<Child>): Promise<Child> => {
    const response = await api.put<Child>(`/family/children/${childId}`, data);
    return response.data;
  },

  // Remove child
  removeChild: async (childId: string): Promise<void> => {
    await api.delete(`/family/children/${childId}`);
  },

  // Grant consent
  grantConsent: async (childId: string, consentType: string): Promise<void> => {
    await api.post(`/family/children/${childId}/consent`, { consentType });
  },

  // Revoke consent
  revokeConsent: async (childId: string, consentType: string): Promise<void> => {
    await api.delete(`/family/children/${childId}/consent/${consentType}`);
  },
};

