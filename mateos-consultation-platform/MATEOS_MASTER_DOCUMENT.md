# 🎓 Mateos Consultation Platform - Master Document
**Дата последнего обновления:** 10 октября 2025  
**Статус проекта:** В активной разработке (Phase 4)

---

## 📋 Содержание
1. [Обзор проекта](#обзор-проекта)
2. [Текущий статус](#текущий-статус)
3. [Архитектура](#архитектура)
4. [Реализованные фазы](#реализованные-фазы)
5. [План на выходные](#план-на-выходные)
6. [Технический стек](#технический-стек)
7. [Установка и запуск](#установка-и-запуск)
8. [Важные особенности](#важные-особенности)

---

## 🎯 Обзор проекта

**Mateos** - платформа для математических консультаций с фокусом на:
- 👨‍👩‍👧‍👦 **Семейная модель** (родитель приглашает детей)
- 👥 **Mini-группы** (3 или 6 человек)
- 📚 **Индивидуальные консультации**
- 📦 **Пакетная система** (5/10/20 уроков)
- 💳 **Подписки** (до 12 уроков/месяц)
- ⏰ **48-часовая политика отмены**

---

## 📊 Текущий статус

### ✅ Завершенные фазы (29.5% общего прогресса)

#### **Phase 1: Types & Interfaces** (4h) - ✅ 100%
- ✅ `Group` interface с `maxCapacity` и `description`
- ✅ `Student` interface с family model (`parentId`, `parent?`)
- ✅ `Consultation` interface с `type` и `individualStudent?`
- ✅ `Parent` и `ChildInvite` для семейной модели
- ✅ `ConsultationType` enum: "Individual" | "Group"

**Файлы:** `src/types/index.ts`

---

#### **Phase 2: Services** (8h) - ✅ 100%
- ✅ `GroupService` - CRUD операции для групп
- ✅ `ConsultationService` - управление консультациями
- ✅ `MaterialService` - образовательные материалы
- ✅ `SubscriptionUsageService` - tracking использования подписок

**Методы GroupService:**
```typescript
getTeacherGroups(): Promise<Group[]>
getById(groupId: string): Promise<Group>
create(data: CreateGroupDto): Promise<Group>
update(groupId: string, data: UpdateGroupDto): Promise<Group>
delete(groupId: string): Promise<void>
addMember(groupId: string, studentId: string): Promise<void>
removeMember(groupId: string, studentId: string): Promise<void>
getMembers(groupId: string): Promise<Student[]>
```

**Файлы:** `src/services/groupService.ts`, `consultationService.ts`, `materialService.ts`, `subscriptionUsageService.ts`

---

#### **Phase 2.5: Parent-Child Services** (4h) - ✅ 100%
- ✅ `FamilyService` - управление семейными связями
- ✅ `InviteChildDialog` - компонент приглашения детей
- ✅ `ChildrenList` - отображение детей в Parent Dashboard

**Методы FamilyService:**
```typescript
inviteChild(email: string, studentName: string): Promise<void>
getChildren(): Promise<Student[]>
getPendingInvites(): Promise<ChildInvite[]>
removeChild(childId: string): Promise<void>
acceptInvite(inviteCode: string): Promise<void>
```

**Файлы:** `src/services/familyService.ts`, `src/components/family/InviteChildDialog.tsx`, `ChildrenList.tsx`

---

#### **Phase 3: Teacher Dashboard Components** (8h) - ✅ 100%
- ✅ `GroupsOverview.tsx` (195 lines) - карточки групп с capacity indicators
- ✅ `IndividualStudents.tsx` (237 lines) - студенты с индивидуальными консультациями
- ✅ `TeacherDashboard.tsx` - интеграция с Tabs (Consultații/Grupe/Elevi Individuali)

**Особенности GroupsOverview:**
- Visual dots indicator (зеленые/красные точки)
- Mini-group badges ("Mini 3" / "Mini 6")
- Click navigation → `/groups/:groupId`
- Empty state с призывом создать группу
- Capacity display: "3/6 membri"

**Особенности IndividualStudents:**
- Группировка консультаций по студентам
- Handling `ConsultationDto` с `individualStudentId: string[]`
- Извлечение `UserDto` из `participants` (PascalCase: Id, Name, Surname, Email)
- Показ ближайшей консультации для каждого студента

**Файлы:** `src/components/teacher/GroupsOverview.tsx`, `IndividualStudents.tsx`, `index.ts`

---

#### **Phase 3.5: Group Capacity UI** (2h) - ✅ 100%
Система визуализации и управления capacity для mini-групп.

##### 1️⃣ **GroupCapacityBadge** (74 lines)
Цветной badge с capacity:
- 🟢 **Зеленый** (<80%): "3/6 locuri"
- 🟠 **Оранжевый** (80-99%): "5/6 locuri" с ⚠️
- 🔴 **Красный** (100%): "6/6 Complet" с ⚠️

```tsx
<GroupCapacityBadge
  currentMembers={5}
  maxCapacity={6}
  variant="compact"
  showIcon={true}
/>
```

##### 2️⃣ **AddMemberDialog** (215 lines)
Dialog для добавления членов с валидацией:
- ✅ Capacity validation ПЕРЕД добавлением
- ✅ Warning alerts (оранжевый при 1-2 свободных местах)
- ✅ Блокировка при полной группе
- ✅ Email search input
- ✅ Keyboard support (Enter to submit)
- ✅ Educational messaging о mini-группах

##### 3️⃣ **GroupCapacityIndicator** (150 lines)
Полный capacity display с Card:
- ✅ Custom progress bar (замена Progress component)
- ✅ Stats grid: Membri / Maximum / Locuri disponibile
- ✅ Status messages (зеленые/оранжевые/красные)
- ✅ Два режима: compact (без Card) и full (с Card)

**Файлы:** `src/components/groups/GroupCapacityBadge.tsx`, `AddMemberDialog.tsx`, `GroupCapacityIndicator.tsx`, `index.ts`

---

#### **Phase 4: Group Details Page** (12h) - 🔄 20% (В ПРОЦЕССЕ)

##### ✅ Что сделано сегодня:

###### 1️⃣ **GroupDetailsPage.tsx** (350 lines)
Comprehensive страница деталей группы:
- ✅ URL param extraction (`useParams<{ groupId }>`)
- ✅ Data loading через `GroupService.getById()`
- ✅ Simple breadcrumb navigation (Dashboard → Grupe → [Group Name])
- ✅ Header с back button, edit, delete actions
- ✅ Overview cards:
  - 📚 Clasa (e.g., "Clasa 10-11")
  - 👥 Membri (3/6 with progress)
  - 📅 Consultații (5 upcoming)
- ✅ `GroupCapacityIndicator` integration (showDetails={true})
- ✅ Members section с title
- ✅ Consultations section с title
- ✅ Metadata footer (created/updated timestamps)

###### 2️⃣ **GroupMembersList.tsx** (235 lines)
Детальный список членов группы:
- ✅ Card grid layout (responsive: 3 col → 2 col → 1 col)
- ✅ Avatar с инициалами (firstName + lastName)
- ✅ Contact info: email, icon badges
- ✅ Class badge (e.g., "Clasa 10")
- ✅ Subject level badge (e.g., "matematică: средний")
- ✅ Remove member button (UserMinus icon)
- ✅ Confirmation dialog с warnings:
  - "Elevul nu va mai putea participa..."
  - "Istoricul consultațiilor rămâne intact"
  - "Poate fi adăugat din nou oricând"
- ✅ Empty state: "Niciun membru" с призывом добавить

###### 3️⃣ **App.tsx Route Integration**
```tsx
<Route path="/groups/:groupId" element={
  <ProtectedRoute>
    <PageTitleProvider>
      <Layout>
        <GroupDetailsPage />
      </Layout>
    </PageTitleProvider>
  </ProtectedRoute>
} />
```

**Файлы:** `src/pages/GroupDetailsPage.tsx`, `src/components/groups/GroupMembersList.tsx`, `src/App.tsx`

##### ⏳ Что осталось для Phase 4 (10h):
- [ ] `GroupConsultationsList.tsx` - comprehensive consultations display с filters/sorting
- [ ] `GroupSettingsDialog.tsx` - edit group (name, description, class, maxCapacity)
- [ ] `RemoveMemberDialog.tsx` - standalone confirmation dialog (если нужен)
- [ ] Empty states для consultations
- [ ] Loading states
- [ ] Error handling improvements
- [ ] Mobile responsive refinements

---

### 📅 Pending Phases (70.5% остается)

#### **Phase 4.5: Cancellation & Rescheduling** (4h)
- [ ] 48-hour cancellation policy UI
- [ ] `CancellationDialog.tsx` с policy explanation
- [ ] `RescheduleDialog.tsx` для смены времени
- [ ] Integration в consultation cards

#### **Phase 5: Attendance Tracking** (10h)
- [ ] `AttendanceMarker.tsx` для отметки присутствия
- [ ] `AttendanceHistory.tsx` - история посещений
- [ ] Integration в consultation details
- [ ] Absence reporting

#### **Phase 6: Materials Management** (10h)
- [ ] `MaterialUploader.tsx` - загрузка файлов
- [ ] `MaterialsList.tsx` - отображение материалов
- [ ] `MaterialViewer.tsx` - preview файлов
- [ ] Filtering by consultation/group

#### **Phase 7: Subscription Usage** (8h)
- [ ] `SubscriptionUsageCard.tsx` - visual tracking
- [ ] `UsageHistory.tsx` - история использования
- [ ] Warning alerts при приближении к лимиту
- [ ] Integration в student dashboard

#### **Phase 7.5: Package Selection UI** (4h) - HIGH PRIORITY
- [ ] `PackageSelector.tsx` для booking flow
- [ ] Display packages:
  - Individual: 5/10/20 уроков × 60/90 мин
  - Group-3: 8 уроков × 60 мин
  - Group-6: 8 уроков × 60 мин
- [ ] Price display с `pricePerLesson` calculations
- [ ] Type badges (Individual/Group-3/Group-6)

#### **Phase 8: Testing & Validation** (8h)
- [ ] Integration tests
- [ ] Component tests
- [ ] E2E critical flows
- [ ] Accessibility audit
- [ ] Performance optimization

#### **Phase 8.5: Teacher Profiles** (6h)
- [ ] `TeacherProfileCard.tsx`
- [ ] Ratings & reviews display
- [ ] Subject specializations
- [ ] Availability calendar

---

## 🏗️ Архитектура

### Frontend Architecture (3-tier)
```
React App
├── Pages (routing layer)
│   └── GroupDetailsPage, DashboardPage, etc.
├── Components (presentation layer)
│   ├── groups/ - GroupMembersList, AddMemberDialog, GroupCapacityIndicator
│   ├── teacher/ - GroupsOverview, IndividualStudents
│   ├── family/ - InviteChildDialog, ChildrenList
│   └── ui/ - shadcn/ui components
├── Services (data layer)
│   └── GroupService, FamilyService, ConsultationService
└── Types (domain models)
    └── Group, Student, Consultation, Parent
```

### Backend Architecture (Clean Architecture)
```
WebAPI → BusinessLayer → DataAccess

WebAPI/
├── Controllers/
│   ├── GroupController.cs
│   ├── ConsultationController.cs
│   └── FamilyController.cs
├── Authorization/
│   └── Custom handlers
└── Services/
    └── SignalRNotifier.cs

BusinessLayer/
├── Interfaces/ (IGroupService, etc.)
├── Implementations/ (GroupService, etc.)
├── DTOs/ (GroupDto, ConsultationDto)
└── Patterns/
    ├── Strategy/ - RatingCalculationStrategy
    ├── Factory/ - UserFactory
    └── Adapter/ - EmailServiceFactory

DataAccess/
├── Models/ (Entities)
├── Repositories/
└── MyDbContext.cs (EF Core)
```

### Design Patterns Used
- **Repository Pattern**: Generic `IRepository<T>` + cached implementations
- **TPH (Table-Per-Hierarchy)**: `User` → `Admin`/`Teacher`/`Student`/`Parent`
- **Strategy Pattern**: Rating calculations (`IRatingStrategy`)
- **Factory Pattern**: User creation (`UserFactory`)
- **Adapter Pattern**: Email services (`IEmailServiceAdapter`)

---

## 💻 Технический стек

### Frontend
- **Framework**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite 6.3.6
- **Routing**: react-router-dom v6 (`useParams`, `useNavigate`)
- **UI Library**: shadcn/ui (Card, Badge, Button, Dialog, Alert, Tabs, Separator)
- **Icons**: lucide-react
- **Styling**: TailwindCSS 3 + PostCSS
- **State**: React Context (AuthContext) + useState/useEffect
- **HTTP**: Axios с interceptors
- **Real-time**: SignalR (`@microsoft/signalr`)
- **Animations**: GSAP (базовые)

### Backend
- **Framework**: ASP.NET Core 8
- **ORM**: Entity Framework Core
- **Database**: SQL Server (планируется)
- **Auth**: JWT Bearer tokens + refresh tokens
- **Real-time**: SignalR Hub (`/notificationHub`)
- **Payments**: Stripe + PayPal (adapter pattern)
- **Email**: SendGrid + Mailgun (adapter pattern)
- **Storage**: Local filesystem (configurable)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript 5.6
- **Testing**: Vitest (planned)
- **Storybook**: Component documentation

---

## 🚀 Установка и запуск

### Prerequisites
```bash
Node.js 18+
npm 9+
```

### Frontend Setup
```bash
# Клонировать репозиторий
git clone <repo-url>
cd mateos-consultation-platform

# Установить зависимости
npm install

# Development сервер
npm run dev        # → http://localhost:5173

# Production build
npm run build      # TypeScript check + Vite build

# Lint check
npm run lint

# Storybook
npm run storybook  # → http://localhost:6006
```

### Backend Setup
```bash
cd Proiect/

# Restore dependencies
dotnet restore

# Run migrations (from DataAccess/)
cd DataAccess
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run API (from WebAPI/)
cd ../WebAPI
dotnet run  # → https://localhost:7001
```

### Environment Variables
Create `.env` in frontend root:
```bash
VITE_API_BASE_URL=https://localhost:7001
VITE_SIGNALR_URL=https://localhost:7001/notificationHub
```

---

## ⚙️ Важные особенности

### 1. Mini-Groups Capacity System
**Бизнес-правила:**
- Группы ограничены 3 или 6 членами
- 🟢 Зеленый: <80% capacity (safe zone)
- 🟠 Оранжевый: 80-99% (warning: 1-2 места осталось)
- 🔴 Красный: 100% (full, блокировка добавления)

**Компоненты:**
- `GroupCapacityBadge` - compact display
- `GroupCapacityIndicator` - full Card с progress bar
- `AddMemberDialog` - validation + warnings

### 2. Family Model (Parent-Child)
**Workflow:**
1. Parent регистрируется
2. Parent отправляет invite по email ребенка
3. Student регистрируется с invite code
4. Связь `parentId` устанавливается в БД
5. Parent видит детей в `ChildrenList`

**Компоненты:**
- `InviteChildDialog` - form для отправки invite
- `ChildrenList` - отображение детей с actions
- `FamilyService` - API calls

### 3. ConsultationDto Handling ⚠️ IMPORTANT
**Backend непостоянен в типе `individualStudentId`:**
```typescript
// ConsultationDto interface
{
  id: string;
  scheduledAt: string;
  status: string;
  individualStudentId: string | string[] | undefined;  // ⚠️ Может быть string ИЛИ array!
  participants: UserDto[];  // ⚠️ PascalCase!
}

// UserDto (PascalCase)
{
  Id: string;
  Name: string;
  Surname: string;
  Email: string;
  Role: string;
}
```

**✅ ОБЯЗАТЕЛЬНО: Нормализуйте перед использованием:**
```typescript
// Helper для нормализации
const normalizeStudentIds = (individualStudentId: string | string[] | undefined): string[] => {
  if (!individualStudentId) return [];
  return Array.isArray(individualStudentId) 
    ? individualStudentId 
    : [individualStudentId];
};

// Usage:
const studentIds = normalizeStudentIds(consultation.individualStudentId);
const studentId = studentIds[0];
const student = consultation.participants?.find(p => p.Id === studentId);
```

**⚠️ Не используйте напрямую:**
```typescript
// ❌ WRONG - может сломаться на string:
consultation.individualStudentId.filter(...)
consultation.individualStudentId.map(...)

// ✅ CORRECT - всегда работает:
const ids = normalizeStudentIds(consultation.individualStudentId);
ids.filter(...)
ids.map(...)
```

**См. также:** `BUGFIX_INDIVIDUAL_STUDENT_ID.md` для подробностей

### 4. Authentication Flow
```
1. Login → POST /api/auth/login
2. Backend sets HttpOnly cookie (JWT + Refresh)
3. Frontend AuthContext updates state
4. API calls auto-include credentials
5. Token refresh на 401 response
6. SignalR connection с JWT в query string
```

### 5. Routing Pattern
```tsx
// Public routes
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />

// Protected routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <PageTitleProvider>
      <Layout>
        <RoleBasedDashboard />
      </Layout>
    </PageTitleProvider>
  </ProtectedRoute>
} />

// Dynamic routes
<Route path="/groups/:groupId" element={
  <ProtectedRoute>
    <Layout>
      <GroupDetailsPage />
    </Layout>
  </ProtectedRoute>
} />
```

### 6. SignalR Integration
```typescript
// Connection management
const connection = new HubConnectionBuilder()
  .withUrl(`${config.signalrUrl}?access_token=${token}`)
  .withAutomaticReconnect()
  .build();

// Event listeners
connection.on('ReceiveNotification', (notification) => {
  // Handle notification
});

// Join user group
connection.invoke('JoinUserGroup', userId);
```

---

## 📦 Last Build Status

```bash
✓ 2676 modules transformed
dist/index.html                   0.95 kB │ gzip:   0.52 kB
dist/assets/logo-CzeFsTXz.svg    42.17 kB │ gzip:  16.66 kB
dist/assets/index-BSaw7wOh.css   83.50 kB │ gzip:  14.12 kB
dist/assets/index-CTMcpZ7e.js   853.50 kB │ gzip: 246.69 kB

✓ built in 2.11s
Exit Code: 0 ✅
```

**⚠️ Warning:** Chunk size >500KB (code splitting recommended)

---

## 🎯 План на выходные (11-12 октября)

### Приоритет 1: Завершить Phase 4 (10h)
- [ ] `GroupConsultationsList.tsx` - список консультаций группы
- [ ] `GroupSettingsDialog.tsx` - редактирование группы
- [ ] Тестирование GroupDetailsPage на всех разрешениях
- [ ] Error boundaries для group operations

### Приоритет 2: Phase 7.5 - Package Selection (4h)
**HIGH BUSINESS VALUE** для MVP!
- [ ] `PackageSelector.tsx` - выбор пакета при booking
- [ ] Display всех типов пакетов (Individual/Group-3/Group-6)
- [ ] Price calculations с `pricePerLesson`
- [ ] Integration в booking flow

### Приоритет 3: Code Quality (6h)
- [ ] Исправить TypeScript warnings (DTOs)
- [ ] Удалить дублирующиеся компоненты (`PaymentFormNew`, `authServiceNew`)
- [ ] Добавить PropTypes/TypeScript validation
- [ ] Code splitting для уменьшения bundle size

### Опционально: Phase 4.5 Start (4h)
- [ ] `CancellationDialog.tsx` с 48-hour policy
- [ ] Integration в consultation cards
- [ ] Policy explanation UI

---

## 📝 Важные команды

```bash
# Development
npm run dev              # Vite dev server

# Production
npm run build            # TypeScript + Vite build
npm run preview          # Preview production build

# Quality
npm run lint             # ESLint check
npm run type-check       # TypeScript validation (если есть)

# Documentation
npm run storybook        # Component docs

# Backend (from Proiect/)
cd DataAccess && dotnet ef migrations add MigrationName
cd DataAccess && dotnet ef database update
cd WebAPI && dotnet run
```

---

## 🐛 Known Issues

1. **Chunk size warning (>500KB)**: Нужен code splitting
2. **TypeScript warnings**: DTOs и типизация требуют доработки
3. **PaymentForm duplication**: Удалить старую версию
4. **GSAP animations**: Incomplete, нужна оптимизация
5. **Mobile responsive**: Частичная поддержка, нужна доработка

---

## 📚 Ключевые файлы

### Components
```
src/components/
├── groups/
│   ├── GroupCapacityBadge.tsx          (74 lines)
│   ├── GroupCapacityIndicator.tsx      (150 lines)
│   ├── AddMemberDialog.tsx             (215 lines)
│   ├── GroupMembersList.tsx            (235 lines)
│   └── index.ts
├── teacher/
│   ├── GroupsOverview.tsx              (195 lines)
│   ├── IndividualStudents.tsx          (237 lines)
│   └── index.ts
└── family/
    ├── InviteChildDialog.tsx
    ├── ChildrenList.tsx
    └── index.ts
```

### Pages
```
src/pages/
├── GroupDetailsPage.tsx                (350 lines)
├── ConsultationsPage.tsx
├── ProfilePage.tsx
└── auth/
    ├── LoginPage.tsx
    └── RegisterPage.tsx
```

### Services
```
src/services/
├── groupService.ts
├── consultationService.ts
├── familyService.ts
├── materialService.ts
├── subscriptionUsageService.ts
└── api.ts (ApiClient singleton)
```

### Types
```
src/types/
└── index.ts
    ├── Group interface
    ├── Student interface (firstName, lastName, class, parentId)
    ├── Consultation interface
    ├── Parent interface
    └── ChildInvite interface
```

---

## 🎨 UI Patterns

### shadcn/ui Components Used
```tsx
// Layout
<Card>, <CardHeader>, <CardTitle>, <CardContent>

// Forms
<Button>, <Input>, <Label>, <Textarea>

// Feedback
<Dialog>, <AlertDialog>, <Toast>, <Alert>

// Navigation
<Tabs>, <TabsList>, <TabsTrigger>, <TabsContent>

// Data Display
<Badge>, <Avatar>, <Separator>

// Custom
<GroupCapacityBadge>, <GroupCapacityIndicator>
```

### Color System (Capacity)
```css
/* Green: <80% */
bg-green-100 text-green-700 border-green-200

/* Orange: 80-99% */
bg-orange-100 text-orange-700 border-orange-300

/* Red: 100% */
bg-red-100 text-red-700 border-red-300
```

---

## 🔗 Полезные ссылки

- **Frontend Repo**: (add link)
- **Backend Repo**: (add link)
- **Figma Design**: (if exists)
- **API Documentation**: `Proiect/API_DOCUMENTATION.md`
- **Test Guide**: `Proiect/API_TESTING_GUIDE.md`

---

## 👥 Team Notes

### Frontend Lead
- Ответственный: Roman
- Фокус: React components, TypeScript, UI/UX
- Current task: Phase 4 - Group Details Page

### Backend Lead
- (Add name)
- Фокус: ASP.NET Core, EF Core, Clean Architecture
- Current task: API stabilization

---

## 📊 Progress Tracking

```
Total Phases: 13
Completed: 4 phases (Phases 1, 2, 2.5, 3, 3.5)
In Progress: 1 phase (Phase 4: 20%)
Remaining: 8 phases

Overall Progress: 29.5%
Estimated Completion: ~60-70 hours remaining
```

**Phase Breakdown:**
- ✅ Phase 1: Types (4h)
- ✅ Phase 2: Services (8h)
- ✅ Phase 2.5: Parent-Child (4h)
- ✅ Phase 3: Teacher Dashboard (8h)
- ✅ Phase 3.5: Group Capacity UI (2h)
- 🔄 Phase 4: Group Details (12h) - 20% done
- ⏳ Phase 4.5: Cancellation (4h)
- ⏳ Phase 5: Attendance (10h)
- ⏳ Phase 6: Materials (10h)
- ⏳ Phase 7: Subscription Usage (8h)
- ⏳ Phase 7.5: Package Selection (4h)
- ⏳ Phase 8: Testing (8h)
- ⏳ Phase 8.5: Teacher Profiles (6h)

---

## 🎯 Success Metrics

### Technical
- ✅ TypeScript strict mode: passing
- ✅ Build успешен: Exit Code 0
- ⚠️ Bundle size: 853.50 kB (нужна оптимизация)
- ⏳ Test coverage: not yet measured
- ⏳ Lighthouse score: not yet measured

### Business
- ✅ Mini-group capacity enforcement: working
- ✅ Family model: implemented
- ⏳ Payment integration: partial
- ⏳ Subscription tracking: in progress
- ⏳ Cancellation policy: not yet

---

**Последнее обновление:** 10 октября 2025, 23:45  
**Следующая сессия:** 11 октября (выходные)  
**Статус:** Ready for weekend work 🚀
