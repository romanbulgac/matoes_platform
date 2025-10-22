# Consultations Components

Модуль компонентов для управления страницей консультаций. Все компоненты используют новую типографическую систему и следуют архитектурным принципам платформы Mateos.

## Компоненты

### 📋 ConsultationPageHeader
Заголовок страницы консультаций с кнопкой создания для учителей.

**Props:**
- `userRole?: string` - роль пользователя (для показа кнопки создания)
- `onCreateClick?: () => void` - callback для создания консультации
- `className?: string` - дополнительные CSS классы

**Использование:**
```tsx
<ConsultationPageHeader
  userRole={user?.role}
  onCreateClick={() => setShowCreateModal(true)}
/>
```

### ⚠️ ConsultationErrorAlert
Компонент для отображения ошибок с возможностью повторной попытки.

**Props:**
- `error: string` - текст ошибки
- `onRetry?: () => void` - callback для повторной попытки
- `className?: string` - дополнительные CSS классы

**Использование:**
```tsx
<ConsultationErrorAlert
  error={error}
  onRetry={loadConsultations}
/>
```

### 📅 ConsultationDayGroup
Группа консультаций на один день, отсортированных по времени.

**Props:**
- `date: string` - дата в ISO формате
- `consultations: ConsultationDto[]` - массив консультаций на эту дату
- `onJoin?: (id: string) => void` - callback присоединения к консультации
- `onLeave?: (id: string) => void` - callback покидания консультации
- `onEdit?: (id: string) => void` - callback редактирования консультации
- `onStart?: (id: string) => void` - callback запуска консультации
- `className?: string` - дополнительные CSS классы

**Использование:**
```tsx
<ConsultationDayGroup
  date="2024-06-23"
  consultations={dayConsultations}
  onJoin={handleJoin}
  onLeave={handleLeave}
  onEdit={handleEdit}
  onStart={handleStart}
/>
```

### 📚 ConsultationGroupedList
Основной компонент для отображения консультаций, сгруппированных по дням (для студентов и других ролей).

**Props:**
- `consultations: ConsultationDto[]` - все консультации
- `onJoin?: (id: string) => void` - callback присоединения
- `onLeave?: (id: string) => void` - callback покидания
- `onEdit?: (id: string) => void` - callback редактирования
- `onStart?: (id: string) => void` - callback запуска
- `onCancel?: (id: string) => void` - callback отмены
- `onCreateClick?: () => void` - callback создания новой консультации
- `onClearFilters?: () => void` - callback очистки фильтров
- `hasActiveFilters?: boolean` - есть ли активные фильтры
- `className?: string` - дополнительные CSS классы

**Особенности:**
- Автоматическая группировка по дням
- Сортировка дней по возрастанию
- Сортировка консультаций внутри дня по времени
- Empty states для пустых списков и отсутствия результатов поиска
- Использует обычный `ConsultationCard`

### 🎓 TeacherConsultationGroupedView
Специальный компонент для отображения консультаций учителей, сгруппированных по дням.

**Props:**
- `consultations: ConsultationDto[]` - все консультации учителя
- `onEdit?: (id: string) => void` - callback редактирования
- `onStart?: (id: string) => void` - callback запуска
- `onCancel?: (id: string) => void` - callback отмены
- `onCreateClick?: () => void` - callback создания новой консультации
- `className?: string` - дополнительные CSS классы

**Особенности:**
- Использует специальный `TeacherConsultationCard` с расширенной информацией
- Показывает информацию о студентах и заработках
- Отображение статуса консультаций с соответствующими действиями
- Специальный empty state для учителей
- Заголовок "Consultațiile Mele"

### 💀 ConsultationLoadingSkeleton
Скелетон для состояния загрузки страницы консультаций.

**Props:**
- `className?: string` - дополнительные CSS классы

**Использование:**
```tsx
if (loading) {
  return <ConsultationLoadingSkeleton />;
}
```

### ➕ CreateConsultationModal
Модальное окно для создания новой консультации.

**Props:**
- `open: boolean` - состояние открытия модала
- `onOpenChange: (open: boolean) => void` - callback изменения состояния
- `onSubmit?: (data: CreateConsultationFormData) => void` - callback отправки формы
- `className?: string` - дополнительные CSS классы

**Types:**
```tsx
interface CreateConsultationFormData {
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  isGroupSession: boolean;
  price: number;
}
```

**Использование:**
```tsx
<CreateConsultationModal
  open={showCreateModal}
  onOpenChange={setShowCreateModal}
  onSubmit={handleCreateConsultation}
/>
```

## Логика группировки по дням

Компоненты автоматически группируют консультации по дням:

1. **Группировка**: консультации группируются по дате (без времени)
2. **Сортировка дней**: по возрастанию (ближайшие дни сначала)
3. **Сортировка консультаций**: внутри дня по времени (раньше сначала)
4. **Форматирование дат**: на румынском языке (понедельник, 23 июня 2024)

## Архитектурные принципы

### ✅ Используется
- Новая типографическая система (`Typography` components)
- Feature-based модульная структура
- Props interface для каждого компонента
- Consistent naming conventions
- TypeScript для type safety
- shadcn/ui design system
- Path aliases (`@/*`)

### ❌ Избегается
- Прямые HTML теги вместо Typography
- Массивные компоненты с множественной ответственностью
- Inline стили вместо Tailwind CSS классов
- Дублирование логики между компонентами

## Примеры использования

### Простая страница консультаций
```tsx
export function ConsultationsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return <ConsultationLoadingSkeleton />;
  }

  return (
    <Typography.Section className="w-full space-y-6">
      <ConsultationPageHeader
        userRole={user?.role}
        onCreateClick={() => setShowCreateModal(true)}
      />

      <ConsultationErrorAlert
        error={error}
        onRetry={loadConsultations}
      />

      <ConsultationGroupedList
        consultations={consultations}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onEdit={handleEdit}
        onStart={handleStart}
        onCreateClick={() => setShowCreateModal(true)}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <CreateConsultationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateConsultation}
      />
    </Typography.Section>
  );
}
```

## Testing & Storybook

Для тестирования компонентов используйте Storybook:

```bash
npm run storybook
```

Все компоненты должны иметь соответствующие `.stories.tsx` файлы для документации и тестирования.