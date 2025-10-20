// Общие типы приложения

// Security types
export * from './security';

// DTO types для API
export * from './dto';

// Re-export UserDto from api.ts (camelCase version)
export type { UserDto } from './api';

// Entity types (за потребы при реализации)
// export * from './entities';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstname: string; // Добавлено для совместимости
  lastname: string;  // Добавлено для совместимости
  lastLoginAt?: string; // Добавлено для совместимости
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Student' | 'Teacher' | 'Administrator' | 'Parent' | 'student' | 'teacher' | 'admin';

// Teacher extends User
export interface Teacher extends User {
  subject: string;
  hireDate: string;
  yearsOfExperience: number;
  department: string;
  consultations?: Consultation[];
  availabilities?: TeacherAvailability[];
  groups?: Group[];
}

// Parent extends User (Family Model)
export interface Parent extends User {
  children: Student[];
  subscriptions: Subscription[];
  totalActiveSubscriptions: number;
}

// Child Invite Token
export interface ChildInvite {
  inviteLink: string;
  token: string;
  expiresAt: string;
  parentId: string;
  used: boolean;
}

export interface UserProfile {
  firstname: string;
  lastname: string;
  avatar?: string;
  phone?: string;
  timezone: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  consultationReminders: boolean;
  paymentReminders: boolean;
}

// API Response типы
export interface APIResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Consultation типы
export enum ConsultationType {
  Individual = 0,
  Group = 1,
  Subscription = 2
}

export interface Consultation {
  id: string;
  teacherId: string;
  studentId: string;
  subject: string;
  description: string;
  scheduledAt: string;
  duration: number; // в минутах
  status: ConsultationStatus;
  price: number;
  currency: string;
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  
  // NEW: Enhanced consultation fields
  topic?: string;
  title?: string;
  link?: string;
  type?: ConsultationType; // Type of consultation (Individual/Group/Subscription)
  consultationType?: ConsultationType;
  
  // NEW: For group consultations
  groupId?: string;
  group?: Group;
  
  // NEW: For individual consultations
  individualStudentId?: string;
  individualStudent?: Student; // Navigation property
  
  // NEW: Student attendance tracking
  studentLinks?: ConsultationStudent[];
  
  // NEW: Materials attached
  materials?: Material[];
}

export type ConsultationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

// NEW: Consultation-Student link with attendance
export interface ConsultationStudent {
  consultationId: string;
  studentId: string;
  attended: boolean;
}

// NEW: Group entity
export interface Group {
  id: string;
  name: string;
  description?: string; // Optional description
  class: string; // "8", "9", "10", "11", "12"
  teacherId?: string;
  groupType: number; // 3 = Small, 6 = Large
  maxCapacity: number; // 3 or 6 (mini-groups)
  members: Student[];
  memberCount: number; // Numărul curent de membri
  availableSlots: number; // Locuri disponibile
  isFull: boolean; // Dacă grupul este plin
  consultations?: Consultation[];
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isActive: boolean;
}

export interface Student {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  class?: string; // "8", "9", "10", "11", "12"
  
  // NEW: Family model - parent relationship
  parentId?: string;
  parent?: Parent;
  
  // NEW: Subject level (e.g., "математика: средний")
  subjectLevel?: string;

  // Statistics
  attendancePercentage?: number; // Procent prezență (0-100)
  averageRating?: number; // Nota medie (0-5)
  totalConsultations?: number; // Total consultații
  attendedConsultations?: number; // Consultații la care a participat
}

// Form типы
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  acceptTerms: boolean;
}

// Component Props типы
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Utility типы
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// Legacy типы для обратной совместимости
export interface AuthResult {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  isOnline: boolean;
  meetingLink?: string;
}

// Уведомления
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  isRead: boolean;
  createdAt: string;
}

// Материалы
export interface Material {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  consultationId?: string;
  fileUrl?: string;
  resourceUri?: string; // Backend uses this
  contentType?: string;
  fileType?: string; // Backend uses this
  updatedAt?: string;
  createdAt: string;
}

// Отзывы
export interface Review {
  id: string;
  studentId: string;
  teacherId: string;
  consultationId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Платежи
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'card' | 'bank_transfer' | 'paypal' | 'crypto';

export interface Payment {
  id: string;
  userId: string;
  consultationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  paymentIntentId?: string;
  transactionId?: string;
  description?: string;
  failureReason?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Расписание преподавателя
export interface TeacherAvailability {
  id: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  availableSlots: string[];
}

// Abonamente - Updated to match backend models
export enum SubscriptionStatus {
  Active = 1,
  PastDue = 2,
  Cancelled = 3,
  Unpaid = 4,
  Incomplete = 5,
  IncompleteExpired = 6,
  Trialing = 7
}

export enum SubscriptionInterval {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Quarterly = 4,
  Yearly = 5
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  externalPriceId: string; // Stripe price ID
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number; // Every X intervals
  trialPeriodDays: number;
  isActive: boolean;
  maxConsultationsPerMonth: number;
  unlimitedConsultations: boolean;
  features?: string; // JSON string of features
  metadata?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Subscription {
  id: string;
  externalSubscriptionId: string; // Stripe subscription ID
  userId: string;
  subscriptionPlanId: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  startDate: string;
  endDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  cancellationReason?: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  metadata?: string;
  subscribedToTeacherId?: string; // Legacy notification subscriptions
  // Navigation properties
  user?: User;
  subscriptionPlan?: SubscriptionPlan;
  subscribedToTeacher?: Teacher;
  payments?: Payment[];
  // Display properties
  statusDisplayName?: string;
  isActive?: boolean;
  isInTrial?: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

// Subscription usage tracking for frontend
export interface SubscriptionUsage {
  subscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  usedConsultations: number;
  maxConsultations: number;
  unlimitedConsultations: boolean;
  remainingConsultations: number | null; // null if unlimited
  canBookMore: boolean;
}

// Planuri de preț
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'lunar' | 'anual';
  consultationsIncluded: number;
  features: string[];
  isPopular: boolean;
  discount?: number; // procent reducere pentru planurile anuale
}

// Заявки студентов
export interface StudentRegistration {
  id: string;
  studentFullname: string;
  parentEmail: string;
  parentPhone: string;
  studentAge: number;
  mathLevel: string;
  specialNeedsDescription?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  trackingCode: string;
  submittedAt: string;
}

// Заявки преподавателей
export interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  qualifications: string;
  experience: string;
  specializations: string[];
  agreedToBackgroundCheck: boolean;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  trackingCode: string;
  submittedAt: string;
}

// Utility типы
export interface PaginationDto {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// ========================================
// FAMILY & CHILD INVITATION DTOs
// Backend: ChildInvitationController.cs, ParentDashboardController.cs
// ========================================

/**
 * DTO для создания приглашения ребенка
 * Backend: POST /ChildInvitation/create
 */
export interface CreateChildInvitationDto {
  childemail: string;
  childName: string;
  childSurname: string;
  childClass?: string;
  mathLevel?: string; // Beginner, Intermediate, Advanced
  expirationDays?: number; // Optional, default 7 days
  personalMessage?: string;
}


/**
 * Response после создания приглашения
 * Backend response от POST /ChildInvitation/create
 */
export interface ChildInvitationResponseDto {
  invitationId: string;
  invitationToken: string;
  invitationLink: string;
  expiresAt: string;
  childemail: string;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Revoked';
}

/**
 * DTO для просмотра списка приглашений
 * Backend: GET /ChildInvitation/my-invitations
 */
export interface ChildInvitationViewDto {
  id: string;
  invitationToken: string;
  childemail: string;
  childName: string;
  childSurname: string;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Revoked';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  studentId?: string; // Если принято
  invitationLink: string;
}

/**
 * Публичная информация о приглашении (без auth)
 * Backend: GET /ChildInvitation/info/{token}
 */
export interface InvitationInfoDto {
  isValid: boolean;
  errorMessage?: string;
  invitationId?: string;
  parentName?: string;
  parentEmail?: string;
  childEmail?: string;
  childName?: string;
  childSurname?: string;
  expiresAt?: string;
  status?: string;
}

/**
 * DTO для принятия приглашения (публичный endpoint)
 * Backend: POST /ChildInvitation/accept
 */
export interface AcceptChildInvitationDto {
  invitationToken: string;
  email: string;
  password: string;
  confirmPassword: string; // Backend requires this field
  name: string;
  surname: string;
  childClass?: string;
  
  // GDPR consents
  agreedToTerms: boolean;
  agreedToDataProcessing: boolean;
  
  // Enriched by frontend before sending
  userAgent?: string;
}

/**
 * Parent Dashboard Overview DTO
 * Backend: GET /ParentDashboard/overview
 */
export interface ParentDashboardOverviewDto {
  totalChildren: number;
  pendingInvitations: number;
  totalInvitations: number;
  children: ChildSummaryDto[];
  recentInvitations: ChildInvitationViewDto[];
  invitationStatistics: InvitationStatisticsDto;
}

/**
 * Child summary для dashboard
 */
export interface ChildSummaryDto {
  id: string;
  name: string; // "Name Surname"
  email: string;
  childClass?: string;
  mathLevel?: string;
  isActive: boolean;
  lastLogin?: string;
  enrollmentDate?: string;
}

/**
 * Invitation statistics
 * Backend: InvitationStatisticsDto from IChildInvitationService
 */
export interface InvitationStatisticsDto {
  totalInvitations: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  expiredInvitations: number;
  cancelledInvitations: number; // Backend uses "Cancelled" not "Revoked"
  activeChildren: number;
  
  // Legacy field for compatibility
  revokedInvitations?: number;
}

/**
 * Детали ребенка для Parent
 * Backend: GET /ParentDashboard/children/{childId}
 */
export interface ChildDetailDto {
  id: string;
  name: string;
  email: string;
  childClass?: string;
  mathLevel?: string;
  isActive: boolean;
  lastLogin?: string;
  enrollmentDate?: string;
  consents: UserConsentDto[];
  invitationInfo?: ChildInvitationViewDto;
  accountCreatedVia: string;
}

/**
 * DTO для управления согласиями ребенка
 * Backend: POST /ParentDashboard/children/{childId}/consents/{consentType}
 */
export interface ManageConsentDto {
  isGranted: boolean;
  reason?: string; // Для отзыва
}

/**
 * DTO для деактивации аккаунта ребенка
 * Backend: POST /ParentDashboard/children/{childId}/deactivate
 */
export interface DeactivateAccountDto {
  reason: string;
  deleteData: boolean; // Right to be forgotten
}

/**
 * User Consent DTO (GDPR)
 * Backend: UserConsentDto from IConsentManagementService
 */
export interface UserConsentDto {
  id: string;
  userId?: string;
  consentType: string;
  consentTypeDisplayName: string; // ✅ FIXED: camelCase (from backend PascalCase ConsentTypeDisplayName)
  isGranted: boolean;
  consentDate: string; // DateTime when granted
  withdrawnDate?: string; // DateTime when withdrawn
  withdrawalReason?: string;
  isActive: boolean;
  consentMethod: string; // Web, API, Email, Phone
  documentVersion?: string;
  isParentalConsent: boolean;
  parentName?: string;
  status?: string; // "Активно", "Отозвано", "Неактивно"
  
  // Legacy fields for compatibility
  grantedAt?: string;
  revokedAt?: string;
  grantedBy?: string; // Parent ID if child consent
  ipAddress?: string;
  userAgent?: string;
}

// Import UserDto locally for use in AuthenticationResultDto
import type { UserDto as ApiUserDto } from './api';

/**
 * AuthenticationResultDto
 * Используется при login/register/accept-invitation
 * Backend возвращает при успешной аутентификации
 */
export interface AuthenticationResultDto {
  isSuccess: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Seconds
  user: ApiUserDto; // camelCase UserDto from api.ts
  errorMessage?: string;
}

// NOTE: UserDto is exported from './api' - no need to redefine here

// =============================================================================
// SUBSCRIPTION SERVICE DTOs
// Backend: SubscriptionsController.cs
// =============================================================================

/**
 * DTO для получения информации о плане подписки
 * Backend: GET /Subscriptions/plans
 */
export interface SubscriptionPlanInfoDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string; // 'Monthly', 'Yearly', etc.
  intervalCount: number;
  trialPeriodDays: number;
  maxConsultationsPerMonth: number;
  unlimitedConsultations: boolean;
  features: string[]; // List of features
  externalPriceId: string; // Stripe/PayPal price ID for checkout
  isPopular?: boolean; // UI hint for most popular plan
  pricePerLesson?: number; // NEW - Цена за одно занятие (если указана в метаданных Stripe)
  formattedDescription?: string; // NEW - "12 занятий × 59 RON = 708 RON / месяц"
}

/**
 * DTO для создания checkout сессии
 * Backend: POST /Subscriptions/create-checkout
 * 
 * NEW: Parent-Student subscription model
 * - parentId: Кто платит за подписку (заполняется автоматически из auth context)
 * - studentId: Для кого оформляется подписка (обязательно выбрать ребёнка)
 */
export interface CreateSubscriptionCheckoutDto {
  planId: string;
  successUrl: string;
  cancelUrl: string;
  parentId?: string;   // NEW - Auto-filled by backend from auth context (Parent ID)
  studentId: string;   // NEW - REQUIRED - ID ребёнка для которого оформляется подписка
  userId?: string;     // Legacy field - for backward compatibility
}

/**
 * DTO результата создания checkout
 * Backend: Response from POST /Subscriptions/create-checkout
 */
export interface SubscriptionCheckoutResultDto {
  success: boolean;
  checkoutUrl: string; // URL для перенаправления на Stripe/PayPal checkout
  sessionId: string; // ID сессии для tracking
  errorMessage?: string;
}

/**
 * DTO статуса подписки пользователя
 * Backend: GET /Subscriptions/status
 */
export interface UserSubscriptionStatusDto {
  userId: string;
  hasActiveSubscription: boolean;
  subscriptionId: string | null;
  planName: string | null;
  status: string | null; // 'Active', 'PastDue', 'Cancelled', 'Trialing', etc.
  currentPeriodEnd: string | null;
  isInTrial: boolean;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  maxConsultationsPerMonth: number;
  unlimitedConsultations: boolean;
}

/**
 * DTO для списка подписок родителя (одна на каждого ребёнка)
 * Backend: GET /Subscriptions/parent/subscriptions
 * 
 * NEW: Parent-Student subscription model
 * Родитель может иметь несколько подписок - по одной на каждого ребёнка
 */
export interface ParentSubscriptionDto {
  subscriptionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  planName: string;
  status: string; // 'Active', 'Cancelled', etc.
  price: number;
  currency: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  maxConsultationsPerMonth: number;
  consultationsUsed: number;        // NEW - использовано этим ребёнком
  consultationsRemaining: number;   // NEW - осталось для этого ребёнка
  unlimitedConsultations: boolean;
}

/**
 * DTO информации о детях родителя
 * Backend: GET /Subscriptions/parent/has-children
 */
export interface ParentChildDto {
  id: string;
  name: string;
  surname: string;
  email: string;
  hasActiveSubscription: boolean; // Есть ли уже подписка у этого ребёнка
}

/**
 * DTO для отмены подписки
 * Backend: POST /Subscriptions/cancel
 */
export interface CancelSubscriptionRequestDto {
  reason?: string;
}

/**
 * DTO результата операции с подпиской
 * Backend: Response from cancel/update operations
 */
export interface SubscriptionOperationResultDto {
  success: boolean;
  message: string;
  errorMessage?: string;
}

/**
 * DTO для обновления подписки (смена плана)
 * Backend: PUT /Subscriptions/update
 */
export interface UpdateUserSubscriptionDto {
  newPlanId: string;
}

/**
 * DTO результата создания billing portal
 * Backend: POST /Subscriptions/billing-portal
 */
export interface BillingPortalResultDto {
  success: boolean;
  portalUrl: string; // URL для перенаправления в Stripe billing portal
  errorMessage?: string;
}

/**
 * DTO статистики использования подписки
 * Backend: GET /Subscriptions/usage
 */
export interface SubscriptionUsageStatsDto {
  subscriptionId?: string;
  planName?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  consultationsUsed: number;
  consultationsLimit: number; // -1 for unlimited
  consultationsRemaining: number; // -1 for unlimited
  unlimitedConsultations: boolean;
  canBookConsultation: boolean;
}

/**
 * DTO результата синхронизации с провайдером
 * Backend: POST /Subscriptions/sync
 */
export interface SyncResultDto {
  success: boolean;
  message: string;
  syncedAt: string;
  changesDetected: boolean;
  errorMessage?: string;
}
