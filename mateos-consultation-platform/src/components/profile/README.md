# Profile Components

Компоненты профиля пользователя разбиты на модульную структуру для удобства разработки и дебага.

## Структура

```
src/
├── pages/
│   └── ProfilePage.tsx              # Главная страница профиля
└── components/
    └── profile/
        ├── index.ts                 # Экспорты компонентов
        ├── ProfileTabs.tsx          # Главный компонент с вкладками
        └── tabs/
            ├── GeneralInfoTab.tsx   # Вкладка общей информации
            ├── SecurityTab.tsx      # Вкладка безопасности
            └── SubscriptionsTab.tsx # Вкладка подписок (только Parent)
```

## Компоненты

### ProfilePage.tsx
**Назначение**: Главная страница профиля  
**Использование**: `/profile`

Простая обёртка, которая:
- Устанавливает title страницы
- Отображает заголовок
- Рендерит `ProfileTabs`

### ProfileTabs.tsx
**Назначение**: Управление вкладками профиля  
**Props**: Нет

Отображает вкладки в зависимости от роли:
- **General** (Общая информация) - для всех
- **Security** (Безопасность) - для всех
- **Subscriptions** (Подписки) - только для Parent

### GeneralInfoTab.tsx
**Назначение**: Редактирование основной информации профиля  
**API Endpoints**:
- `GET /api/Users/profile` - получение данных
- `PUT /api/Users/profile` - обновление профиля

**Функции**:
- Просмотр и редактирование: имя, фамилия, email, телефон
- Загрузка аватара
- Для Teacher: дополнительные поля (bio, специализации)
- Информация о системе: роль, дата создания, последний вход

### SecurityTab.tsx
**Назначение**: Управление безопасностью аккаунта  
**API Endpoints**:
- `POST /api/Auth/change-password` - смена пароля
- `GET /api/Session/active` - активные сессии (через SessionManager)

**Функции**:
- Смена пароля (с валидацией)
- Управление активными сессиями (SessionManager компонент)
- Завершение сессий на других устройствах

### SubscriptionsTab.tsx
**Назначение**: Управление подписками детей (только для Parent)  
**API Endpoints**:
- `GET /api/Subscriptions/my-children` - список подписок детей

**Функции**:
- Отображение всех подписок детей
- Статус каждой подписки (Active, Trialing, Canceled и т.д.)
- Информация о следующем платеже
- Лимиты консультаций
- Переход к управлению подпиской

## Используемые сервисы

### UserService
```typescript
UserService.getProfile()        // Получить профиль
UserService.updateProfile(data) // Обновить профиль
```

### AuthService
```typescript
AuthService.changePassword(current, newPassword) // Сменить пароль
```

### SessionService
```typescript
SessionService.getActiveSessions()        // Активные сессии
SessionService.revokeSession(sessionId)   // Завершить сессию
SessionService.revokeAllOtherSessions()   // Завершить все другие
```

## Типы данных

### UserDto (Backend)
```csharp
{
  Id: string;
  Email: string;
  Name: string;      // Имя
  Surname: string;   // Фамилия
  Role: string;
  PhoneNumber?: string;
  ProfilePicture?: string;
  LastLogin: DateTime;
  CreatedAt: DateTime;
}
```

### User (Frontend)
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profile: UserProfile;
  lastLoginAt?: string;
}
```

## Как добавить новую вкладку

1. Создайте компонент в `tabs/`:
```typescript
// tabs/NewTab.tsx
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NewTab: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Новая вкладка</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Ваш контент */}
      </CardContent>
    </Card>
  );
};
```

2. Экспортируйте в `index.ts`:
```typescript
export { NewTab } from './tabs/NewTab';
```

3. Добавьте в `ProfileTabs.tsx`:
```typescript
<TabsTrigger value="new">
  <Icon className="w-4 h-4" />
  Новая вкладка
</TabsTrigger>

<TabsContent value="new">
  <NewTab />
</TabsContent>
```

## Стилизация

Используются компоненты из `@/components/ui`:
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button`, `Input`, `Label`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Avatar`, `Badge`, `Skeleton`

Все стили следуют TailwindCSS convention.

## Дебаг

### Проверка данных профиля
```typescript
console.log('User:', user);
console.log('Profile data:', formData);
```

### Проверка API запросов
Откройте DevTools → Network и фильтруйте по `/api/Users` или `/api/Auth`

### Проверка состояния
React DevTools → Components → ProfileTabs → hooks

## TODO / Будущие улучшения

- [ ] Добавить загрузку и обрезку аватара
- [ ] Реализовать 2FA (Two-Factor Authentication)
- [ ] Добавить экспорт данных (GDPR)
- [ ] История изменений профиля
- [ ] Настройки уведомлений
- [ ] Интеграция с календарём
