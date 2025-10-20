# 🔍 Analiză Discrepanțe Arhitectură - Mateos Platform

**Data:** 10 octombrie 2025  
**Scop:** Identificare diferențe între arhitectura actuală și cerințele noi de business

---

## 📊 Tabel Comparativ - Funcționalități Critice

| # | Funcționalitate | Status Actual | Cerință Nouă | Gap | Prioritate | Estimare |
|---|----------------|---------------|--------------|-----|------------|----------|
| 1 | **Înregistrare utilizatori** | Toți rolurile se pot înregistra | **DOAR Parent** poate crea cont | 🔴 MAJOR | CRITICAL | 2-3 zile |
| 2 | **Relație Parent-Student** | Simplă (vizualizare) | **Parent = Proprietar și Administrator** | 🔴 MAJOR | CRITICAL | 3-5 zile |
| 3 | **Model de plată** | Fiecare user plătește | **DOAR Parent plătește** | 🔴 MAJOR | CRITICAL | 2-3 zile |
| 4 | **Sistem abonamente** | Subscripție simplă lunară | **Pachete lecții** (4, 8, 12) | 🟠 MEDIUM | HIGH | 4-6 zile |
| 5 | **Tipuri consultații** | Doar individuale | **Individual + Mini-Grupuri** | 🔴 MAJOR | HIGH | 5-7 zile |
| 6 | **GDPR pentru minori** | Consimțământ individual | **Parent semnează pentru copii** | 🔴 MAJOR | CRITICAL | 3-4 zile |
| 7 | **Înregistrare profesori** | Direct registration | **Aplicație + Aprobare Admin** | 🟠 MEDIUM | MEDIUM | 2-3 zile |
| 8 | **Dashboard Parent** | Foarte simplu | **Complex (familie, copii, abonamente)** | 🔴 MAJOR | HIGH | 5-7 zile |
| 9 | **Tracking lecții** | Nu există | **Contor lecții rămase din pachet** | 🔴 MAJOR | HIGH | 2-3 zile |
| 10 | **Mini-grupuri** | ❌ Nu există | **Grupuri 3-5 elevi cu slots** | 🔴 MAJOR | HIGH | 6-8 zile |

**Legendă:**
- 🔴 MAJOR = Breaking change, necesită refactoring major
- 🟠 MEDIUM = Modificări semnificative, dar non-breaking
- 🟢 MINOR = Adăugări simple, fără impact pe arhitectură

---

## 🏗️ Analiza pe Layer-uri

### 1️⃣ DATABASE LAYER (DataAccess)

#### ✅ Ce EXISTĂ și este OK:
```
✓ Tabel Users cu TPH (Teacher, Student, Parent, Admin)
✓ Tabel Consultations
✓ Tabel Subscriptions (bază)
✓ EF Core migrations setup
✓ Soft delete pattern
✓ Audit fields (CreatedAt, UpdatedAt)
```

#### ❌ Ce LIPSEȘTE:
```sql
-- Tabele noi necesare:
✗ Family (grupare familie)
✗ FamilyMember (relație Parent-Student)
✗ FamilyConsent (GDPR pentru minori)
✗ SubscriptionPackage (definiție pachete)
✗ FamilySubscription (pachete achiziționate)
✗ MiniGroup (grupuri de elevi)
✗ GroupEnrollment (înscriere în grup)
✗ GroupSession (ședințe grup)
✗ TeacherApplication (aplicații profesori)
```

#### 🔧 Modificări necesare în tabele existente:
```sql
-- Users table
ALTER TABLE Users ADD COLUMN FamilyId GUID NULL;
ALTER TABLE Users ADD COLUMN AccessStatus VARCHAR(50) DEFAULT 'Active';
ALTER TABLE Users ADD COLUMN ApprovedBy GUID NULL;

-- Consultations table
ALTER TABLE Consultations ADD COLUMN ConsultationType VARCHAR(20); -- 'Individual' | 'MiniGroup'
ALTER TABLE Consultations ADD COLUMN GroupId GUID NULL;
ALTER TABLE Consultations ADD COLUMN SubscriptionId GUID NULL;
ALTER TABLE Consultations ADD COLUMN FamilyId GUID NULL;

-- Subscriptions table (rename to FamilySubscriptions)
-- sau păstrezi ambele pentru backwards compatibility
```

**Estimare:** 3-5 zile (design schema + migrations + testing)

---

### 2️⃣ BUSINESS LAYER

#### ✅ Ce EXISTĂ:
```csharp
✓ IAuthService
✓ IConsultationService
✓ IUserService
✓ ISubscriptionService (basic)
✓ INotificationService
✓ DTOs pentru entități existente
```

#### ❌ Ce LIPSEȘTE:
```csharp
// Servicii noi necesare:
✗ IFamilyManagementService
  - CreateFamilyAsync()
  - AddChildAsync()
  - RemoveChildAsync()
  - GetFamilyMembersAsync()

✗ ISubscriptionPackageService
  - GetAvailablePackagesAsync()
  - PurchasePackageAsync()
  - UseSubscriptionLessonAsync()
  - GetRemainingLessonsAsync()

✗ IGdprConsentService
  - GrantConsentAsync()
  - RevokeConsentAsync()
  - ValidateConsentsAsync()

✗ IMiniGroupService
  - CreateGroupAsync()
  - EnrollStudentAsync()
  - GetAvailableGroupsAsync()
  - ManageGroupScheduleAsync()

✗ ITeacherApplicationService
  - SubmitApplicationAsync()
  - ReviewApplicationAsync()
  - ApproveTeacherAsync()
  - RejectTeacherAsync()
```

#### 🔧 Modificări în servicii existente:

**IAuthService:**
```csharp
// Current
Task<AuthResult> RegisterAsync(RegisterDto dto); // Accepts all roles

// Needed
Task<AuthResult> RegisterParentAsync(RegisterParentDto dto); // ONLY Parent
Task<bool> SubmitTeacherApplicationAsync(TeacherApplicationDto dto); // For teachers
```

**IConsultationService:**
```csharp
// Adăugări necesare:
Task<ConsultationDto> BookIndividualAsync(BookIndividualDto dto);
Task<ConsultationDto> BookGroupSessionAsync(BookGroupDto dto);
Task<bool> ValidateFamilySubscriptionAsync(Guid familyId, string type);
```

**ISubscriptionService (existent):**
```csharp
// Current - user-based
Task<SubscriptionDto> GetUserSubscriptionAsync(Guid userId);

// Needed - family-based
Task<List<FamilySubscriptionDto>> GetFamilySubscriptionsAsync(Guid familyId);
Task<int> GetRemainingLessonsAsync(Guid familyId, string packageType);
```

**Estimare:** 4-6 zile (implementare servicii + unit tests)

---

### 3️⃣ WEB API LAYER

#### ✅ Ce EXISTĂ:
```
✓ AuthController (login, register)
✓ ConsultationsController
✓ UsersController
✓ SubscriptionsController (basic)
✓ NotificationsController
✓ JWT authentication
✓ Role-based authorization
```

#### ❌ Ce LIPSEȘTE:

**Controllere noi necesare:**
```csharp
✗ FamiliesController
  POST   /api/families                    // Create family (auto for Parent)
  GET    /api/families/my-family          // Get my family
  GET    /api/families/{id}/children      // Get family members
  POST   /api/families/{id}/children      // Add child
  DELETE /api/families/children/{childId} // Remove child

✗ SubscriptionPackagesController
  GET  /api/subscription-packages         // Browse packages
  GET  /api/subscription-packages/{id}    // Package details
  POST /api/subscription-packages/purchase // Buy package

✗ GdprConsentsController
  POST   /api/gdpr/consent/{studentId}    // Grant consent
  GET    /api/gdpr/consent/family/{familyId} // All family consents
  POST   /api/gdpr/consent/{id}/revoke    // Revoke consent
  GET    /api/gdpr/consent/validate/{studentId} // Check valid consents

✗ MiniGroupsController
  GET  /api/mini-groups/available         // Browse groups
  GET  /api/mini-groups/{id}              // Group details
  POST /api/mini-groups                   // Create group (Teacher)
  POST /api/mini-groups/{id}/enroll       // Enroll student
  GET  /api/mini-groups/my-enrollments    // My enrollments

✗ TeacherApplicationsController
  POST /api/teacher-applications          // Submit application
  GET  /api/teacher-applications/{id}     // Get application (Admin)
  PUT  /api/teacher-applications/{id}/approve // Approve (Admin)
  PUT  /api/teacher-applications/{id}/reject  // Reject (Admin)
```

#### 🔧 Modificări în controllere existente:

**AuthController:**
```csharp
// Modifică:
[HttpPost("register")]
public async Task<IActionResult> Register(RegisterDto dto)
{
    // STERGE: if (dto.Role == "Teacher") { ... }
    // STERGE: if (dto.Role == "Student") { ... }
    
    // ADAUGĂ: Accept DOAR Role = "Parent"
    if (dto.Role != "Parent") 
        return BadRequest("Only parents can register");
}

// Adaugă endpoint nou:
[HttpPost("apply/teacher")]
public async Task<IActionResult> ApplyAsTeacher(TeacherApplicationDto dto)
{
    // Teacher application flow
}
```

**ConsultationsController:**
```csharp
// Adaugă:
[HttpPost("individual")]
[Authorize(Policy = "ParentOnly")]
public async Task<IActionResult> BookIndividual(BookIndividualDto dto)

[HttpPost("group-session")]
[Authorize(Policy = "ParentOnly")]
public async Task<IActionResult> BookGroupSession(BookGroupDto dto)

[HttpGet("family/{familyId}")]
[Authorize(Policy = "FamilyOwner")]
public async Task<IActionResult> GetFamilyConsultations(Guid familyId)
```

#### 🔐 Authorization Policies noi:

```csharp
// Program.cs - Adăugări
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ParentOnly", policy => 
        policy.RequireRole("Parent"));
    
    options.AddPolicy("FamilyOwner", policy => 
        policy.Requirements.Add(new FamilyOwnerRequirement()));
    
    options.AddPolicy("CanManageChild", policy => 
        policy.Requirements.Add(new ChildManagementRequirement()));
    
    options.AddPolicy("TeacherOrAdmin", policy => 
        policy.RequireRole("Teacher", "Administrator"));
});
```

**Estimare:** 3-4 zile (endpoints + authorization + API tests)

---

### 4️⃣ FRONTEND - ENTITIES & TYPES

#### ✅ Ce EXISTĂ:
```typescript
✓ src/entities/user.ts
✓ src/entities/consultation.ts
✓ src/types/api.ts (DTOs base)
✓ Role types (Student, Teacher, Parent, Admin)
```

#### ❌ Ce LIPSEȘTE:

**Fișiere noi necesare:**
```typescript
// src/entities/family.ts
export interface Family {
  id: string;
  parentId: string;
  familyName: string;
  isActive: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  studentUserId: string;
  studentName: string;
  relationship: string;
  dateOfBirth: string;
  gradeLevel: string;
  hasParentalConsent: boolean;
}

// src/entities/subscriptionPackage.ts
export interface SubscriptionPackage {
  id: string;
  name: string;
  packageType: 'Individual' | 'MiniGroup';
  lessonsIncluded: number;
  durationMinutes: number;
  price: number;
  maxGroupSize?: number;
  validityDays: number;
}

export interface FamilySubscription {
  id: string;
  familyId: string;
  packageId: string;
  lessonsTotal: number;
  lessonsUsed: number;
  lessonsRemaining: number;
  status: 'Active' | 'Expired' | 'Completed';
  purchasedAt: string;
  expiresAt: string;
}

// src/entities/miniGroup.ts
export interface MiniGroup {
  id: string;
  name: string;
  teacherId: string;
  subject: string;
  level: string;
  maxStudents: number;
  currentStudents: number;
  status: 'Open' | 'Full' | 'InProgress' | 'Closed';
}

export interface GroupEnrollment {
  id: string;
  groupId: string;
  studentId: string;
  familyId: string;
  status: 'Pending' | 'Active' | 'Completed';
  enrolledAt: string;
}

// src/entities/gdprConsent.ts
export interface FamilyConsent {
  id: string;
  familyId: string;
  studentId: string;
  consentType: 'DataProcessing' | 'PhotoVideo' | 'Marketing';
  isGranted: boolean;
  consentDate: string;
  signatureData?: string;
}
```

#### 🔧 Modificări în entități existente:

**src/entities/user.ts:**
```typescript
export interface User {
  // Existing fields...
  
  // ✨ ADĂUGĂRI:
  familyId?: string; // null pentru Parent, set pentru Student
  accessStatus?: 'PendingApproval' | 'Active' | 'Suspended';
  approvedBy?: string; // ParentId sau AdminId
}
```

**src/entities/consultation.ts:**
```typescript
export interface Consultation {
  // Existing fields...
  
  // ✨ ADĂUGĂRI:
  consultationType: 'Individual' | 'MiniGroup';
  studentId?: string;      // Pentru individual
  groupId?: string;        // Pentru grup
  subscriptionId?: string; // Link la pachet folosit
  familyId?: string;       // Cine plătește
}
```

**Estimare:** 2-3 zile (definire tipuri + validation)

---

### 5️⃣ FRONTEND - SERVICES

#### ✅ Ce EXISTĂ:
```typescript
✓ src/services/authService.ts
✓ src/services/consultationService.ts
✓ src/services/userService.ts
✓ src/services/subscriptionService.ts (basic)
✓ src/services/notificationService.ts
✓ src/services/api.ts (ApiClient singleton)
```

#### ❌ Ce LIPSEȘTE:

**Servicii noi necesare:**
```typescript
// src/services/familyService.ts
export class FamilyService {
  static async getMyFamily(): Promise<Family>;
  static async createFamily(data: CreateFamilyDto): Promise<Family>;
  static async getMyChildren(): Promise<FamilyMember[]>;
  static async addChild(data: AddChildDto): Promise<FamilyMember>;
  static async removeChild(childId: string): Promise<void>;
}

// src/services/subscriptionPackageService.ts
export class SubscriptionPackageService {
  static async getAvailablePackages(type?: string): Promise<SubscriptionPackage[]>;
  static async purchasePackage(data: PurchaseDto): Promise<FamilySubscription>;
  static async getFamilySubscriptions(): Promise<FamilySubscription[]>;
  static async getRemainingLessons(type: string): Promise<number>;
}

// src/services/gdprConsentService.ts
export class GdprConsentService {
  static async grantConsent(studentId: string, data: ConsentDto): Promise<FamilyConsent>;
  static async revokeConsent(consentId: string): Promise<void>;
  static async getStudentConsents(studentId: string): Promise<FamilyConsent[]>;
  static async validateConsents(studentId: string): Promise<boolean>;
}

// src/services/miniGroupService.ts
export class MiniGroupService {
  static async getAvailableGroups(filters: GroupFilters): Promise<MiniGroup[]>;
  static async enrollStudent(groupId: string, data: EnrollDto): Promise<GroupEnrollment>;
  static async createGroup(data: CreateGroupDto): Promise<MiniGroup>;
  static async getTeacherGroups(): Promise<MiniGroup[]>;
}

// src/services/teacherApplicationService.ts
export class TeacherApplicationService {
  static async submitApplication(data: ApplicationDto): Promise<Application>;
  static async getApplicationStatus(id: string): Promise<ApplicationStatus>;
}
```

#### 🔧 Modificări în servicii existente:

**authService.ts:**
```typescript
// Current
static async register(data: RegisterDto): Promise<AuthResult>

// Change to
static async registerParent(data: RegisterParentDto): Promise<AuthResult>
static async applyAsTeacher(data: TeacherApplicationDto): Promise<void>
```

**consultationService.ts:**
```typescript
// Adaugă:
static async bookIndividual(data: BookIndividualDto): Promise<Consultation>
static async bookGroupSession(data: BookGroupDto): Promise<Consultation>
static async getFamilyConsultations(familyId: string): Promise<Consultation[]>
```

**Estimare:** 3-4 zile (implementare servicii + error handling)

---

### 6️⃣ FRONTEND - COMPONENTS

#### ✅ Ce EXISTĂ:
```
✓ ParentDashboard (очень базовый)
✓ StudentDashboard
✓ TeacherDashboard
✓ AdminDashboard
✓ ConsultationCard
✓ PaymentForm
✓ NotificationCenter
```

#### ❌ Ce LIPSEȘTE (componente noi necesare):

**Family Management:**
```
✗ FamilyOverviewCard.tsx
✗ ChildrenListCard.tsx
✗ AddChildModal.tsx
✗ ChildDetailCard.tsx
✗ EditChildModal.tsx
```

**Subscription Packages:**
```
✗ PackageCard.tsx
✗ PackageGrid.tsx
✗ PackageComparisonTable.tsx
✗ PackageSelectionModal.tsx
✗ PurchasePackageFlow.tsx
```

**Mini Groups:**
```
✗ MiniGroupCard.tsx
✗ MiniGroupDetails.tsx
✗ GroupEnrollmentModal.tsx
✗ CreateGroupForm.tsx
✗ GroupScheduleEditor.tsx
✗ GroupParticipantsList.tsx
```

**GDPR Consents:**
```
✗ ConsentFormModal.tsx
✗ ConsentsList.tsx
✗ DigitalSignaturePad.tsx
✗ ConsentDocumentViewer.tsx
```

**Teacher Application:**
```
✗ TeacherApplicationForm.tsx
✗ ApplicationStatusCard.tsx
✗ DocumentUploadSection.tsx
```

#### 🔧 Componente existente de modificat:

**ParentDashboard.tsx:**
```tsx
// Current: Very basic, shows mock data
// Needed: Complete rewrite with:
// - Family overview
// - Children cards
// - Subscription status
// - Quick actions (Add child, Buy package, Book consultation)
// - Upcoming consultations for all children
```

**ConsultationCard.tsx:**
```tsx
// Adaugă suport pentru:
// - consultationType (Individual vs MiniGroup)
// - Display group info dacă e grup
// - Show subscription source (din ce pachet)
```

**RegisterPage.tsx:**
```tsx
// ȘTERGE: Role selection dropdown
// MODIFICĂ: Doar formular pentru Parent
// ADAUGĂ: Link către teacher application
```

**Estimare:** 5-7 zile (componente noi + refactoring existente)

---

### 7️⃣ FRONTEND - PAGES

#### ✅ Ce EXISTĂ:
```
✓ /login
✓ /register (trebuie modificată)
✓ /dashboard (role-based)
✓ /consultations
✓ /profile
✓ /subscriptions (basic)
```

#### ❌ Ce LIPSEȘTE (pagini noi necesare):

**Family Management:**
```
✗ /family/overview
✗ /family/children
✗ /family/child/:id
✗ /family/consents
```

**Subscription Packages:**
```
✗ /packages (browse packages)
✗ /packages/:id (package details)
✗ /packages/purchase (checkout flow)
✗ /family/subscriptions (manage subscriptions)
```

**Mini Groups:**
```
✗ /mini-groups/browse
✗ /mini-groups/:id
✗ /teacher/groups (pentru profesori)
✗ /teacher/groups/create
✗ /teacher/groups/:id/manage
```

**Teacher Application:**
```
✗ /teacher/apply
✗ /teacher/application/:id (status)
✗ /admin/applications (pentru admin)
```

**Live Session (din plan original):**
```
✗ /consultations/:id/live
```

**Estimare:** 4-5 zile (pagini noi + routing)

---

### 8️⃣ FRONTEND - ROUTING & GUARDS

#### 🔧 Modificări necesare:

**src/App.tsx - Routes:**
```tsx
// Adaugă noi rute:
<Route path="/family/*" element={<ParentGuard><FamilyRoutes /></ParentGuard>} />
<Route path="/packages/*" element={<ProtectedRoute><PackagesRoutes /></ProtectedRoute>} />
<Route path="/mini-groups/*" element={<ProtectedRoute><GroupsRoutes /></ProtectedRoute>} />
<Route path="/teacher/apply" element={<TeacherApplicationPage />} />
<Route path="/admin/applications" element={<AdminGuard><ApplicationsPage /></AdminGuard>} />

// Modifică ruta register:
<Route path="/register" element={<ParentRegisterPage />} /> {/* DOAR Parent */}
```

**Guards noi necesare:**
```typescript
// src/guards/ParentGuard.tsx
export const ParentGuard: FC = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'Parent' ? children : <Navigate to="/access-denied" />;
}

// src/guards/FamilyOwnerGuard.tsx
export const FamilyOwnerGuard: FC = ({ familyId, children }) => {
  // Validate user owns this family
}

// src/guards/TeacherGuard.tsx
export const TeacherGuard: FC = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'Teacher' ? children : <Navigate to="/access-denied" />;
}
```

**Estimare:** 1-2 zile (routing + guards)

---

## 🎯 SUMMARY - Ce trebuie făcut

### DATABASE (DataAccess)
- ✅ **7 tabele noi**
- ✅ **3 tabele modificate**
- ✅ **4-5 migrații EF Core**
- ⏱️ **Estimare:** 3-5 zile

### BACKEND (BusinessLayer + WebAPI)
- ✅ **5 servicii noi**
- ✅ **3 servicii modificate**
- ✅ **5 controllere noi**
- ✅ **3 controllere modificate**
- ✅ **4 authorization policies noi**
- ⏱️ **Estimare:** 7-10 zile

### FRONTEND (React)
- ✅ **6 fișiere entități noi**
- ✅ **5 servicii API noi**
- ✅ **2 servicii modificate**
- ✅ **25+ componente noi**
- ✅ **3 componente modificate major**
- ✅ **10+ pagini noi**
- ✅ **3 guards noi**
- ⏱️ **Estimare:** 15-20 zile

### TESTING & POLISH
- ✅ **Unit tests**
- ✅ **Integration tests**
- ✅ **E2E critical paths**
- ✅ **UI/UX refinement**
- ⏱️ **Estimare:** 5-7 zile

### DOCUMENTATION & DEPLOYMENT
- ✅ **API documentation update**
- ✅ **User guides**
- ✅ **Migration scripts**
- ✅ **Data migration**
- ⏱️ **Estimare:** 3-4 zile

---

## ⚠️ BREAKING CHANGES

### 1. Registration Flow
**Impact:** 🔴 HIGH  
**Afectează:** Toți utilizatorii noi  
**Mitigare:** 
- Pagină explicativă pentru useri existenți
- Email notification cu instrucțiuni

### 2. Payment Model
**Impact:** 🔴 HIGH  
**Afectează:** Toți utilizatorii care plătesc  
**Mitigare:**
- Backwards compatibility pentru subscripții existente
- Migration assistant pentru convertire la model familie

### 3. Consultation Booking
**Impact:** 🟠 MEDIUM  
**Afectează:** Studenți care rezervau singuri  
**Mitigare:**
- Parent trebuie să rezerve pentru copii
- Păstrare booking history existent

---

## 🚀 RECOMMENDATION - Phased Rollout

### Phase 1: Foundation (Săptămâna 1-2)
- Database schema changes
- Backend services foundation
- CRITICAL: Nu deploy în production încă

### Phase 2: Core Features (Săptămâna 3-4)
- Family management
- Subscription packages
- Frontend components
- Testing în staging environment

### Phase 3: Advanced Features (Săptămâna 5-6)
- Mini groups
- GDPR consents
- Teacher applications
- Beta testing cu useri selectați

### Phase 4: Launch (Săptămâna 7)
- Data migration
- Full deployment
- Monitoring și hotfixes

---

**Total Estimated Time:** 33-50 zile lucrătoare (1.5-2.5 luni)

**Status:** ✅ ANALIZĂ COMPLETĂ  
**Proximi Pași:** Review cu echipa → Start implementare

