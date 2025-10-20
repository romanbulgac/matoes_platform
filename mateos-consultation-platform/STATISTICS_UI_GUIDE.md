# 📊 Статистики Членів Групи - Візуальний Гайд

## Огляд Інтерфейсу

### 🎯 Повний Вигляд Сторінки Групи

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Назад до групи                                 [⚙️ Opțiuni]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📚 Clasa 10A                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                   │
│  Capacitate Grup              [▓▓▓▓▓░░░░░] 50%                  │
│  👥 3/6 membri                                                   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Membrii grupului  (3 membri înscriși)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ IP           │  │ MP            │  │ AN           │          │
│  │ Ion Popescu  │  │ Maria Popescu │  │ Ana Nistor   │          │
│  │ ion@email... │  │ maria@email..│  │ ana@email... │          │
│  │ ──────────── │  │ ──────────── │  │ ──────────── │          │
│  │ 🟢 85% prez. │  │ 🟡 65% prez. │  │ [Fără cons.] │          │
│  │ ⭐ 4.3       │  │ ⭐ 3.8       │  │              │          │
│  │ [Clasa 10]   │  │ [Clasa 10]   │  │ [Clasa 10]   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Componente Detaliate

### 1️⃣ Card Student cu Statistici Complete

```
┌────────────────────────────────────────────────┐
│  IP   Ion Popescu                          [×] │
│       ion.popescu@example.com                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📧 ion.popescu@example.com                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🟢 85% prezență    ⭐ 4.3                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Clasa 10]  [Intermediate]                    │
└────────────────────────────────────────────────┘

Detalii:
- Avatar: Inițiale "IP" pe fundal primary/10
- Nume: Bold, text-sm
- Email: text-xs, text-muted-foreground
- Separator: border-t
- Prezență: Color-coded dot + procent
  • 🟢 Verde (≥80%): bg-green-500
  • 🟡 Galben (60-79%): bg-yellow-500
  • 🔴 Roșu (<60%): bg-red-500
- Rating: Emoji stea + cifră (0.0-5.0)
- Badge-uri: Clasa, Nivel
- Buton șterge: Icon UserMinus (dreapta sus)
```

### 2️⃣ Card Student Nou (Fără Consultații)

```
┌────────────────────────────────────────────────┐
│  AN   Ana Nistor                           [×] │
│       ana.nistor@example.com                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📧 ana.nistor@example.com                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Fără consultații încă]                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Clasa 10]  [Beginner]                        │
└────────────────────────────────────────────────┘

Detalii:
- În loc de statistici: Badge outline "Fără consultații încă"
- Aspect neutru (nu negativ)
- Placeholder până la prima consultație
```

### 3️⃣ Loading State

```
┌────────────────────────────────────────────────┐
│                                                 │
│                    ⏳                           │
│               (spinner animat)                  │
│                                                 │
│          Se încarcă statisticile...             │
│                                                 │
│   Calculăm prezența și notele medii pentru     │
│              fiecare membru.                    │
│                                                 │
└────────────────────────────────────────────────┘

Detalii:
- Loader2 icon cu className="animate-spin"
- Text centrat
- Border dashed pentru a indica loading
- Se afișează ~1-2 secunde în timpul fetch
```

### 4️⃣ Empty State

```
┌────────────────────────────────────────────────┐
│                                                 │
│               ┌───────┐                         │
│               │  👤-  │  (icon UserMinus)       │
│               └───────┘                         │
│                                                 │
│              Niciun membru                      │
│                                                 │
│   Acest grup nu are încă membri. Adăugați      │
│   primul elev pentru a începe consultațiile.   │
│                                                 │
└────────────────────────────────────────────────┘
```

## Color Palette pentru Statistici

### Prezență (Attendance)

| Procent | Culoare | Cod Tailwind | Interpretare |
|---------|---------|--------------|--------------|
| ≥80%    | 🟢 Verde | `bg-green-500` | Excelent |
| 60-79%  | 🟡 Galben | `bg-yellow-500` | Satisfăcător |
| <60%    | 🔴 Roșu | `bg-red-500` | Necesită atenție |

### Rating (Note Medii)

| Rating | Display | Interpretare |
|--------|---------|--------------|
| 4.5-5.0 | ⭐ 4.8 | Excepțional |
| 4.0-4.4 | ⭐ 4.2 | Foarte bun |
| 3.5-3.9 | ⭐ 3.7 | Bun |
| 3.0-3.4 | ⭐ 3.2 | Satisfăcător |
| <3.0    | ⭐ 2.5 | Sub așteptări |
| null/0  | (ascuns) | Fără evaluări |

## Responsive Design

### Desktop (≥1024px) - 3 coloane
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Student1 │  │ Student2 │  │ Student3 │
└──────────┘  └──────────┘  └──────────┘
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Student4 │  │ Student5 │  │ Student6 │
└──────────┘  └──────────┘  └──────────┘
```
**Grid:** `grid-cols-3 gap-4`

### Tablet (768px-1023px) - 2 coloane
```
┌──────────┐  ┌──────────┐
│ Student1 │  │ Student2 │
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│ Student3 │  │ Student4 │
└──────────┘  └──────────┘
```
**Grid:** `md:grid-cols-2 gap-4`

### Mobile (<768px) - 1 coloană
```
┌──────────────┐
│  Student 1   │
└──────────────┘
┌──────────────┐
│  Student 2   │
└──────────────┘
┌──────────────┐
│  Student 3   │
└──────────────┘
```
**Grid:** `grid-cols-1 gap-4`

## Interacțiuni

### 1. Hover pe Card
```css
hover:shadow-md transition-shadow
```
- Card se ridică ușor (shadow mai pronunțat)
- Tranziție smooth

### 2. Click pe Buton Șterge
```
1. Click [×] → Se deschide dialog de confirmare
2. Dialog afișează:
   ┌─────────────────────────────────────┐
   │  ⚠️  Eliminare membru din grup      │
   │                                      │
   │  Sigur doriți să eliminați pe       │
   │  Ion Popescu din acest grup?        │
   │                                      │
   │  Consecințe:                        │
   │  • Nu va mai putea participa...     │
   │  • Istoricul rămâne intact          │
   │  • Poate fi adăugat din nou         │
   │                                      │
   │  [Anulează]  [Elimină membru]      │
   └─────────────────────────────────────┘
3. După confirmare → Loading → Statistici reîncarcate
```

### 3. După Ștergere Membru
```
Flux:
1. API call: DELETE /api/groups/{id}/members/{studentId}
2. Toast success: "✅ Membru șters"
3. Auto-reload: GET /api/groups/{id}/members/statistics
4. UI update cu noi date
```

## Exemple de Date

### JSON Response de la API
```json
[
  {
    "Id": "guid-1",
    "Name": "Ion",
    "Surname": "Popescu",
    "Email": "ion@example.com",
    "Class": "10",
    "AttendancePercentage": 85.5,
    "AverageRating": 4.3,
    "TotalConsultations": 20,
    "AttendedConsultations": 17
  },
  {
    "Id": "guid-2",
    "Name": "Ana",
    "Surname": "Nistor",
    "Email": "ana@example.com",
    "Class": "10",
    "AttendancePercentage": 0,
    "AverageRating": null,
    "TotalConsultations": 0,
    "AttendedConsultations": 0
  }
]
```

### Mapped Frontend Object
```typescript
{
  id: "guid-1",
  firstName: "Ion",
  lastName: "Popescu",
  email: "ion@example.com",
  class: "10",
  attendancePercentage: 85.5,
  averageRating: 4.3,
  totalConsultations: 20,
  attendedConsultations: 17
}
```

## Accessibility

### ARIA Labels
```html
<div role="region" aria-label="Membrii grupului">
  <div role="list">
    <div role="listitem">
      <span aria-label="Prezență 85%">🟢 85% prezență</span>
      <span aria-label="Rating 4.3 din 5">⭐ 4.3</span>
    </div>
  </div>
</div>
```

### Keyboard Navigation
- Tab: Navighează între butoane de ștergere
- Enter/Space: Deschide dialog confirmare
- Escape: Închide dialog

## Performance

### Optimizări Actuale
- ✅ Single API call pentru toate statisticile
- ✅ useEffect cu dependencies array
- ✅ Loading state pentru UX smooth

### Viitoare (Recomandări)
```typescript
// React Query pentru caching
const { data, isLoading } = useQuery(
  ['group-members', groupId],
  () => GroupService.getMembersWithStatistics(groupId),
  { staleTime: 30000 } // Cache 30 secunde
);
```

---

**Note:** Toate iconițele și culorile respectă design system-ul shadcn/ui și Tailwind CSS v3.
