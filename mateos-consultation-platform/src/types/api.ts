// Типы данных для Mathematics Consultation Platform

// Import SessionDto from security types to avoid duplication
import type { SessionDto } from './security';
import type { Group } from './index';

// ==================== AUTH TYPES ====================
export interface RegisterRequestDto {
  role: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  hasAcceptedPrivacyPolicy: boolean;
  hasAcceptedTerms: boolean;
  hasAcceptedMarketing?: boolean;
  hasAcceptedCookies?: boolean;
  hasAcceptedAttendanceTracking?: boolean;
  hasAcceptedPaymentTracking?: boolean;
  hasAcceptedGroupPlacement?: boolean;
  hasAcceptedScheduleTracking?: boolean;
  studentName?: string;
  parentName?: string;
  consentTimestamp?: string;
  consentIPAddress?: string;
  consentUserAgent?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  platform?: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  operatingSystemVersion?: string;
  screenResolution?: string;
  timeZone?: string;
  language?: string;
  rememberDevice?: boolean;
}

export interface LoginResponse {
  success: boolean;                 // Status de succes (conform documentației)
  message: string;                  // Mesaj de răspuns
  token: string;                    // JWT access token
  refreshToken: string;             // Refresh token
  expiresIn: number;                // Timp de expirare în secunde (3600 = 1 oră)
  user: UserDto;                    // Informații utilizator
  session?: SessionDto;             // Informații despre sesiune (opțional, imported from security.ts)
}

// Register Response - DIFERIT de Login! (conform documentației)
export interface RegisterResponse {
  token: string;                    // JWT access token (valabil 1 oră)
  refreshToken?: string;            // Refresh token (opțional în documentație)
  user: UserDto;                    // Informații utilizator
  // ⚠️ NOTĂ: Register NU returnează success/message/expiresIn/session conform documentației
}

export interface TokenRequestDto {
  token: string;
  refreshToken: string;
}

// ==================== USER TYPES ====================
export interface UserDto {
  id: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber?: string;
  role: string;
  userType: string;
  isActive: boolean;
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== CONSULTATION TYPES ====================
export enum ConsultationStatus {
  Scheduled = 0,
  InProgress = 1, 
  Completed = 2,
  Cancelled = 3
}

export enum ConsultationType {
  Individual = 0,
  Group = 1
}

export interface ConsultationDto {
  id: string;
  title: string;
  topic: string;
  description: string;
  teacherId: string;
  teacherName: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  isGroupSession: boolean;
  price: number;
  status: ConsultationStatus;
  link?: string;
  consultationType: ConsultationType;
  groupId?: string;
  groupName?: string;
  individualStudentId?: string;
  studentId?: string[];
  participants: UserDto[];
  materials: MaterialDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationDto {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  isGroupSession: boolean;
  price: number;
}

// ==================== MATERIAL TYPES ====================
export interface MaterialDto {
  id: string;
  title: string;
  description?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  teacherId: string;
  consultationId?: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialDto {
  title: string;
  description?: string;
  consultationId?: string;
  isPublic: boolean;
}

// ==================== NOTIFICATION TYPES ====================
export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  isRead: boolean;
  createdAt: string;
}

export interface InAppNotificationRequestDto {
  userId?: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
}

// ==================== REVIEW TYPES ====================
export interface ReviewDto {
  id: string;
  studentId: string;
  studentName: string;
  consultationId: string;
  teacherId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewDto {
  consultationId: string;
  rating: number;
  comment?: string;
}

// ==================== PAYMENT TYPES ====================
export interface PaymentDto {
  id: string;
  userId: string;
  consultationId: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  consultationId: string;
  paymentMethodId?: string;
  billingDetails?: BillingDetailsDto;
}

export interface BillingDetailsDto {
  name: string;
  email: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentResultDto {
  isSuccess: boolean;
  paymentId?: string;
  clientSecret?: string;
  errorMessage?: string;
}

// ==================== SUBSCRIPTION TYPES ====================
export interface SubscriptionPlanDto {
  Id: string;
  Name: string;
  Description: string;
  Price: number;
  Currency: string;
  Interval: string; // "Lunar" or "Anual"
  TrialPeriodDays: number;
  MaxConsultationsPerMonth: number;
  UnlimitedConsultations: boolean;
  Features: string[];
  ExternalPriceId: string;
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlanDto;
  status: 'Active' | 'Cancelled' | 'Expired' | 'Trial';
  startDate: string;
  endDate: string;
  consultationsUsed: number;
  consultationsRemaining: number;
  autoRenew: boolean;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDto {
  subscriptionPlanId: string;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
}

// Статус подписки пользователя
export interface SubscriptionStatusDto {
  UserId: string;
  HasActiveSubscription: boolean;
  SubscriptionId?: string;
  PlanName?: string;
  Status?: string;
  CurrentPeriodEnd?: string;
  IsInTrial: boolean;
  TrialEnd?: string;
  CancelAtPeriodEnd: boolean;
  MaxConsultationsPerMonth: number;
  UnlimitedConsultations: boolean;
}

// ==================== TEACHER AVAILABILITY TYPES ====================
export interface TeacherAvailabilityDto {
  id: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isRecurring: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  availableSlots: string[];
  isActive: boolean;
}

export interface CreateTeacherAvailabilityDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface FindAvailableSlotsRequestDto {
  teacherId?: string;
  startDate: string;
  endDate: string;
  preferredStartTime?: string;
  preferredEndTime?: string;
  duration?: number;
}

export interface AvailableSlotDto {
  teacherId: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  isGroupSlot: boolean;
  availableSpots: number;
}

// ==================== FILE TYPES ====================
export interface FileInfoDto {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedBy: string;
  downloadCount: number;
  createdAt: string;
}

export interface FileUploadResultDto {
  isSuccess: boolean;
  fileId?: string;
  fileName?: string;
  errorMessage?: string;
}

// ==================== CONTACT TYPES ====================
export interface ContactFormDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResponded: boolean;
  responseMessage?: string;
  respondedAt?: string;
  respondedBy?: string;
  createdAt: string;
}

// ==================== STUDENT REGISTRATION TYPES ====================
export interface StudentRegistrationDto {
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  studentFirstName: string;
  studentLastName: string;
  studentAge: number;
  studentGrade: string;
  preferredSchedule: string;
  specialNeedsDescription?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  agreedToTerms: boolean;
}

export interface StudentRegistrationStatusDto {
  id: string;
  trackingCode: string;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  studentFullName: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ==================== TEACHER APPLICATION TYPES ====================
export interface TeacherApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  qualifications?: string;
  education?: string;
  experience: string;
  specializations: string[];
  preferredAgeGroups?: string[];
  availability?: string;
  motivation?: string;
  teachingMethodology?: string;
  availableHours?: string;
  agreedToBackgroundCheck: boolean;
  agreedToTerms?: boolean;
  agreedToDataProcessing?: boolean;
}

export interface TeacherReferenceDto {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  institution: string;
}

export interface TeacherApplicationStatusDto {
  id: string;
  fullName: string;
  email: string;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ==================== STATISTICS TYPES ====================
export interface TeacherStatsDto {
  teacherId: string;
  teacherName: string;
  totalConsultations: number;
  completedConsultations: number;
  averageRating: number;
  totalStudents: number;
  popularityScore: number;
}

export interface PlatformStatsDto {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalConsultations: number;
  completedConsultations: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

// ==================== SHARED TYPES ====================
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponseType {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponseType;

// ==================== PROGRESS TYPES ====================
export interface StudentProgressOverviewDto {
  studentId: string;
  studentName: string;
  overallProgress: number;
  totalTopicsStarted: number;
  topicsMastered: number;
  topicsNeedingReview: number;
  subjectProgress: SubjectProgressDto[];
  recentAchievements: RecentAchievementDto[];
  upcomingMilestones: UpcomingMilestoneDto[];
  currentStreak: string;
  totalPoints: number;
  lastActivity: string;
}

export interface SubjectProgressDto {
  subject: string;
  progressPercentage: number;
  topicsCompleted: number;
  totalTopics: number;
  averageAccuracy: number;
  totalTimeSpent: string; // TimeSpan as string
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
}

export interface RecentAchievementDto {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: string;
  pointsEarned: number;
  unlockedAt: string;
}

export interface UpcomingMilestoneDto {
  title: string;
  description: string;
  progressToMilestone: number;
  pointsReward: number;
  estimatedCompletion?: string;
}

export interface StudentProgressDetailedDto {
  studentId: string;
  subject: string;
  topicProgress: TopicProgressDto[];
  recentSessions: LearningSessionDto[];
  weakAreas: WeakAreaDto[];
  trends: ProgressTrendsDto;
  startDate?: string;
  endDate?: string;
}

export interface TopicProgressDto {
  topic: string;
  completionPercentage: number;
  accuracyRate: number;
  timeSpent: string; // TimeSpan as string
  attemptsCount: number;
  status: string;
  lastPracticed: string;
  mistakePatterns: string[];
}

export interface LearningSessionDto {
  id: string;
  startTime: string;
  endTime?: string;
  duration: string; // TimeSpan as string
  type: string;
  exercisesCompleted: number;
  exercisesCorrect: number;
  accuracyRate: number;
  xpEarned: number;
  notes?: string;
}

export interface WeakAreaDto {
  subject: string;
  topic: string;
  accuracyRate: number;
  attemptsCount: number;
  commonMistakes: string[];
  recommendedActions: string[];
  priority: number; // 1-10, higher = more urgent
}

export interface ProgressTrendsDto {
  dailyProgress: DailyProgressPoint[];
  accuracyTrend: AccuracyTrendPoint[];
  timeSpentTrend: TimeSpentPoint[];
  progressTrendDirection: number; // Positive/negative
  trendAnalysis: string;
}

export interface DailyProgressPoint {
  date: string;
  progressPercentage: number;
  exercisesCompleted: number;
  timeSpent: string; // TimeSpan as string
}

export interface AccuracyTrendPoint {
  date: string;
  accuracyRate: number;
  subject: string;
}

export interface TimeSpentPoint {
  date: string;
  timeSpent: string; // TimeSpan as string
  sessionsCount: number;
}

export interface RecordAchievementDto {
  studentId: string;
  achievementType: string;
  context: string;
  metadata: Record<string, unknown>;
}

export interface LearningPathDto {
  studentId: string;
  recommendedSteps: LearningPathStepDto[];
  missingPrerequisites: PrerequisiteDto[];
  estimatedCompletionDays: number;
  generatedAt: string;
}

export interface LearningPathStepDto {
  order: number;
  subject: string;
  topic: string;
  description: string;
  estimatedHours: number;
  difficultyLevel: number;
  resources: string[];
  exercises: string[];
  rationale: string;
}

export interface PrerequisiteDto {
  subject: string;
  topic: string;
  reason: string;
  priority: number;
}

export interface StartSessionDto {
  subject: string;
  topic: string;
  sessionType: string; // Practice, Review, Assessment
  metadata: Record<string, unknown>;
}

export interface EndSessionDto {
  exercisesCompleted: number;
  exercisesCorrect: number;
  duration: string; // TimeSpan as string
  notes?: string;
  topicsCovered: string[];
  sessionData: Record<string, unknown>;
}

export interface ProgressStatisticsDto {
  studentId: string;
  startDate: string;
  endDate: string;
  subject?: string;
  
  // Overall statistics
  totalTimeSpent: string; // TimeSpan as string
  totalExercises: number;
  totalCorrectExercises: number;
  overallAccuracy: number;
  sessionsCount: number;
  
  // Daily averages
  avgDailyTime: string; // TimeSpan as string
  avgDailyExercises: number;
  avgDailyAccuracy: number;
  
  // Progress indicators
  progressGrowth: number; // Percentage improvement
  subjectStats: SubjectStatisticsDto[];
  dailyBreakdown: DailyProgressPoint[];
  
  // Achievements during period
  achievementsEarned: number;
  xpEarned: number;
  streakDays: number;
}

export interface SubjectStatisticsDto {
  subject: string;
  timeSpent: string; // TimeSpan as string
  exercisesCompleted: number;
  accuracyRate: number;
  progressPercentage: number;
  topicBreakdown: TopicProgressDto[];
}

// ==================== STUDENT DASHBOARD TYPES ====================
export interface StudentDashboardData {
  overview: StudentProgressOverviewDto;
  upcomingConsultations: ConsultationDto[];
  groups: Group[];
  recentMaterials: MaterialDto[];
  subscriptionStatus: SubscriptionStatusDto;
}

/**
 * Opțiuni pentru formularele de invitație copii
 */
export const ChildInvitationOptions = {
  classOptions: ["8","12"],
  mathLevelOptions: [
    { value: "Beginner", label: "Începător" },
    { value: "Intermediate", label: "Mediu" },
    { value: "Advanced", label: "Avansat" }
  ]
} as const;
