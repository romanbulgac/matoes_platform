---
applyTo: '**'
---
# Mateos Consultation Platform - AI Agent Instructions

## Arhitectură Generală

Această platformă educațională pentru consultații matematice folosește:
- **React 18** + **TypeScript** + **Vite** + **TailwindCSS** + **shadcn/ui**
- **Arhitectură feature-based** cu separarea logică în module
- **React Query** pentru management state server-side și cache
- **SignalR** pentru comunicare în timp real (notificări, chat)
- **Context Pattern** pentru authentication și global state
- **Path aliases** (`@/*`) pentru importuri curate

## Patternuri Critice de Urmat

### 1. Structură de Import și Export
```typescript
// ✅ Folosește întotdeauna path aliases
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/entities';

// ✅ Export pattern pentru features
export * from './auth';
export * from './dashboard';
```

### 2. Arhitectură Componente
```typescript
// ✅ Pattern standard pentru toate componentele
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  // alte props tipizate strict
}

export const Component: FC<ComponentProps> = ({ className, ...props }) => {
  return (
    <div className={cn("clase-de-baza", className)}>
      {/* content */}
    </div>
  );
};
```

### 3. Service Layer cu API Client
- Toate serviciile extind pattern-ul din `src/services/api.ts` 
- Folosește `ApiClient` singleton pentru requests autentificate
- Gestionează CSRF tokens și retry logic automat
- Implementează paginare consistentă cu `PagedResult<T>`

### 4. SignalR Integration
- Connection management în `src/services/signalr.ts`
- Auto-reconnect cu backoff exponențial
- User group joining pentru notificări personalizate
- Error handling pentru connection failures

## Workflow-uri Esențiale

### Development
```bash
npm run dev          # Vite dev server
npm run build        # TypeScript check + build  
npm run lint         # ESLint validation
npm run storybook    # Component documentation
```

### Testing Architecture
- Storybook pentru documentare și testing componente
- Visual testing cu Chromatic (`npm run chromatic`)
- TypeScript strict mode pentru type safety

## Convenții Specifice Proiectului

### 1. Role-Based Components
Platforma gestionează 4 roluri distinct: `Student`, `Teacher`, `Parent`, `Admin`
```typescript
// Pattern folosit în src/components/dashboards/
export const TeacherDashboard: FC = () => {
  // logică specifică profesorilor
};
```

### 2. Feature-Based Modules  
```
src/features/
├── auth/           # Login, register, JWT management
├── consultations/  # Booking, scheduling, payments
├── dashboard/      # Role-specific dashboards
```

### 3. Environment Configuration
Configuration singleton în `src/config/environment.ts`:
- Validare obligatorie pentru `VITE_API_BASE_URL`, `VITE_SIGNALR_URL`
- Runtime validation pentru URL format
- Singleton pattern pentru performance

### 4. shadcn/ui Integration
```bash
# Adaugă componente noi doar așa:
npx shadcn@latest add [component-name]

# ❌ Nu modifica direct componentele din src/components/ui/
# ✅ Customizează prin className și CSS variables
```

## Aspecte Critice de Securitate

### JWT Management
- Token storage în localStorage (temporal - security audit planificat)
- Auto-refresh token logic în AuthContext
- CSRF protection în API calls

### Error Boundaries
- `ErrorBoundary.tsx` component pentru crash protection
- Context-specific error handling în services
- User-friendly error messages în română

## Integration Points Critice

### 1. Payment System
Două implementări paralele (refactoring în curs):
- `PaymentForm.tsx` - implementare actuală
- `PaymentFormNew.tsx` - versiune optimizată

### 2. Notification System
```typescript
// Pattern din NotificationCenter.tsx
const { addNotification } = useNotification();
addNotification({
  type: 'success',
  message: 'Consultația a fost programată'
});
```

### 3. GSAP Animations
- Performance-optimized hooks în `src/hooks/useGsapOptimized.ts`
- Use `gsap.set()` pentru instant positioning
- Cleanup în useEffect returns

## Common Pitfalls să Evitați

1. **Nu duplica serviciile** - verifică src/services/ înainte de crearea de noi
2. **Nu bypassa AuthContext** - folosește `useAuth()` pentru toate user operations  
3. **Nu ignora TypeScript errors** - rulează `npm run build` pentru validare
4. **Nu modifica direct shadcn/ui** - extinde prin composition
5. **Nu uita de role permissions** - verifică user role înainte de rendering

## Debugging și Performance

### SignalR Connection Issues
```typescript
// Check connection status în browser dev tools
console.log('SignalR State:', connection.state);
```

### React Query Cache Debugging
- React Query DevTools sunt configurate în development
- Invalidări cache prin mutation success callbacks

### GSAP Performance
- Folosește `useGsapOptimized` pentru animații complexe  
- Prefer `transform` over layout properties pentru 60fps

Toate textele în proiect sunt în **română** - mențineți această convenție la adăugarea de content nou.