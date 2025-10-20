# 🐛 Bug Fix: individualStudentId Type Handling

**Дата:** 12 октября 2025  
**Проблема:** `TypeError: consultation.individualStudentId.filter is not a function`  
**Причина:** Backend иногда возвращает `individualStudentId` как строку, а не массив  
**Статус:** ✅ Исправлено

---

## 📋 Описание проблемы

### Error Stack:
```
TypeError: consultation.individualStudentId.filter is not a function
    at TeacherConsultationCard.tsx:32
    at TeacherConsultationGroupedView.tsx:26
```

### Причина:
Backend API непостоянен в типе `individualStudentId`:
- ❌ Иногда: `"student-id-123"` (string)
- ✅ Ожидалось: `["student-id-123"]` (string[])

Frontend код предполагал, что это всегда массив и использовал:
```typescript
consultation.individualStudentId.filter(...)  // ❌ Breaks on string
consultation.individualStudentId.includes(...) // ❌ Breaks on string
```

---

## ✅ Решение

Добавлена нормализация типа во всех местах использования:

```typescript
// Helper function pattern:
const normalizeStudentIds = (individualStudentId: string | string[] | undefined) => {
  if (!individualStudentId) return [];
  return Array.isArray(individualStudentId) 
    ? individualStudentId 
    : [individualStudentId];
};

// Usage:
const studentIds = normalizeStudentIds(consultation.individualStudentId);
studentIds.filter(...) // ✅ Always works
```

---

## 📝 Измененные файлы

### 1. **TeacherConsultationCard.tsx** (строка 79-86)
**Было:**
```typescript
const getEnrolledCount = () => {
  if (consultation.individualStudentId && consultation.individualStudentId.length > 0) {
    return consultation.individualStudentId.filter(id => id.trim()).length;
  }
  return 0;
};
```

**Стало:**
```typescript
const getEnrolledCount = () => {
  if (!consultation.individualStudentId) return 0;
  
  const studentIds = Array.isArray(consultation.individualStudentId) 
    ? consultation.individualStudentId 
    : [consultation.individualStudentId];
  
  return studentIds.filter(id => id && id.trim()).length;
};
```

---

### 2. **TeacherDashboard.tsx** (строка 76-81)
**Было:**
```typescript
const totalStudents = new Set(
  consultations.flatMap(c => c.individualStudentId || [])
).size;
```

**Стало:**
```typescript
const totalStudents = new Set(
  consultations.flatMap(c => {
    if (!c.individualStudentId) return [];
    return Array.isArray(c.individualStudentId) 
      ? c.individualStudentId 
      : [c.individualStudentId];
  })
).size;
```

---

### 3. **ConsultationsPage.tsx** (строка 192-205)
**Было:**
```typescript
setConsultations(prev => prev.map(consultation => 
  consultation.id === id 
    ? { 
        ...consultation, 
        individualStudentId: consultation.individualStudentId?.filter(id => id !== user?.id)
      }
    : consultation
));
```

**Стало:**
```typescript
setConsultations(prev => prev.map(consultation => {
  if (consultation.id !== id) return consultation;
  
  const studentIds = Array.isArray(consultation.individualStudentId)
    ? consultation.individualStudentId
    : consultation.individualStudentId 
      ? [consultation.individualStudentId]
      : [];
  
  return {
    ...consultation,
    individualStudentId: studentIds.filter(studentId => studentId !== user?.id)
  };
}));
```

---

### 4. **ConsultationCard.tsx** (строка 86-93)
**Было:**
```typescript
const isUserEnrolled = () => {
  return consultation.individualStudentId?.includes(user?.id || '');
};
```

**Стало:**
```typescript
const isUserEnrolled = () => {
  if (!consultation.individualStudentId || !user?.id) return false;
  
  const studentIds = Array.isArray(consultation.individualStudentId)
    ? consultation.individualStudentId
    : [consultation.individualStudentId];
  
  return studentIds.includes(user.id);
};
```

---

### 5. **IndividualStudents.tsx** (строка 86-92)
**Было:**
```typescript
const studentIds = consultation.individualStudentId || [];
```

**Стало:**
```typescript
const studentIds = !consultation.individualStudentId 
  ? []
  : Array.isArray(consultation.individualStudentId)
    ? consultation.individualStudentId
    : [consultation.individualStudentId];
```

---

## 🧪 Тестирование

### Сценарии покрыты:
1. ✅ `individualStudentId` как `string` → нормализуется в `[string]`
2. ✅ `individualStudentId` как `string[]` → используется как есть
3. ✅ `individualStudentId` как `undefined` → возвращается `[]`
4. ✅ `individualStudentId` как `null` → возвращается `[]`

### Тестовые данные:
```typescript
// Case 1: String
{ individualStudentId: "abc-123" }
→ normalizes to: ["abc-123"] ✅

// Case 2: Array
{ individualStudentId: ["abc-123", "def-456"] }
→ stays: ["abc-123", "def-456"] ✅

// Case 3: Undefined
{ individualStudentId: undefined }
→ becomes: [] ✅

// Case 4: Empty array
{ individualStudentId: [] }
→ stays: [] ✅
```

---

## 🚀 Build Status

```bash
✓ 2676 modules transformed
dist/assets/index-BoUHYMii.js   853.83 kB │ gzip: 246.78 kB
✓ built in 2.34s
Exit Code: 0 ✅
```

**Все компоненты скомпилированы без ошибок!**

---

## 💡 Рекомендации

### Для Backend Team:
**TODO:** Стандартизировать тип `individualStudentId` в API:
```csharp
// ConsultationDto.cs
public class ConsultationDto 
{
    // ❌ Current (inconsistent):
    public object IndividualStudentId { get; set; }
    
    // ✅ Recommended (always array):
    public List<string> IndividualStudentIds { get; set; } = new();
}
```

### Для Frontend Team:
**Pattern to follow** при работе с потенциально несогласованными типами:

```typescript
// Create normalization helper
const normalizeToArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// Use consistently
const ids = normalizeToArray(consultation.individualStudentId);
```

---

## 📚 Related Documentation

- **Master Doc:** `MATEOS_MASTER_DOCUMENT.md` (section: ConsultationDto Handling)
- **API Docs:** `Proiect/API_DOCUMENTATION.md`
- **Types:** `src/types/api.ts` (ConsultationDto interface)

---

## ✅ Verification Checklist

- [x] Build успешен (Exit Code 0)
- [x] TypeScript errors устранены
- [x] Все использования `individualStudentId` обновлены
- [x] Протестирована нормализация всех типов
- [x] Документация обновлена

---

**Статус:** ✅ Resolved  
**Build:** Успешен  
**Breaking Changes:** Нет  
**Backward Compatible:** Да
