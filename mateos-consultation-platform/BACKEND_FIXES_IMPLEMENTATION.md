# Backend API Fixes - Implementation Guide

## 📌 Обзор
Этот документ содержит точные изменения, которые нужно внести в backend для соответствия frontend API.

---

## 🔧 Fix #1: Generate Group Name Endpoint

### Файл: `GroupsController.cs`

### Добавить после метода `GetAllGroups()`:

```csharp
/// <summary>
/// Генерация имени группы по классу
/// </summary>
/// <param name="studentClass">Класс (например, "5A", "10B")</param>
/// <returns>Сгенерированное имя группы</returns>
[HttpGet("generate-name/{studentClass}")]
public async Task<ActionResult<object>> GenerateGroupName(string studentClass)
{
    try
    {
        if (string.IsNullOrWhiteSpace(studentClass))
        {
            return BadRequest(new { message = "Student class is required" });
        }

        // Логика генерации имени группы
        var existingGroups = await _groupService.GetGroupsByClassAsync(studentClass);
        var groupNumber = existingGroups.Count() + 1;
        var groupName = $"Grupa {studentClass} - {groupNumber}";

        _logger.LogInformation("Generated group name: {GroupName} for class {StudentClass}", 
            groupName, studentClass);

        return Ok(new { groupName });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error generating group name for class {StudentClass}", studentClass);
        return StatusCode(500, new { message = "Internal server error while generating group name" });
    }
}
```

**Проверка**:
```bash
curl -X GET "https://localhost:7001/Groups/generate-name/5A" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Ожидаемый ответ**:
```json
{
  "groupName": "Grupa 5A - 3"
}
```

---

## 🔧 Fix #2: Respond to Contact Endpoint

### Файл: `ContactController.cs`

### Создать DTO:

```csharp
// В BusinessLayer/DTOs/ContactDtos.cs (или создать новый файл)
public class RespondToContactDto
{
    [Required]
    [StringLength(5000, MinimumLength = 10)]
    public string Response { get; set; } = string.Empty;
}
```

### Добавить в `ContactController.cs` после метода `UpdateMessageStatus()`:

```csharp
/// <summary>
/// Отправить email-ответ на контактное сообщение
/// </summary>
/// <param name="id">ID сообщения</param>
/// <param name="dto">Текст ответа</param>
/// <returns>Результат операции</returns>
[HttpPost("{id:guid}/respond")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> RespondToContact(Guid id, [FromBody] RespondToContactDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        var userId = GetCurrentUserId();
        
        // Получаем сообщение
        var message = await _contactService.GetContactMessageAsync(id);
        if (message == null)
        {
            return NotFound(new { message = "Mesajul nu a fost găsit." });
        }

        // Отправляем email-ответ
        var emailSent = await _contactService.SendResponseEmailAsync(id, dto.Response, userId);
        
        if (!emailSent)
        {
            return StatusCode(500, new { message = "Eroare la trimiterea email-ului de răspuns." });
        }

        // Обновляем статус на InProgress или Resolved
        await _contactService.UpdateMessageStatusAsync(id, ContactStatus.Resolved, userId);

        // Логируем действие
        await _auditService.LogActionAsync(
            "Contact Response Sent",
            "ContactMessage",
            userId,
            id,
            message.Email,
            GetClientIpAddress(),
            GetUserAgent(),
            "UPDATE",
            null,
            $"Response sent to {message.Email}",
            GetUserAgent()
        );

        return Ok(new { 
            success = true,
            message = "Răspunsul a fost trimis cu succes." 
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error responding to contact message: {MessageId}", id);
        return StatusCode(500, new { message = "A apărut o eroare la trimiterea răspunsului." });
    }
}
```

### Добавить метод в `IContactService.cs`:

```csharp
Task<bool> SendResponseEmailAsync(Guid messageId, string responseText, Guid adminUserId);
```

### Реализовать в `ContactService.cs`:

```csharp
public async Task<bool> SendResponseEmailAsync(Guid messageId, string responseText, Guid adminUserId)
{
    try
    {
        var message = await GetContactMessageAsync(messageId);
        if (message == null) return false;

        // Используем существующий email service
        var emailBody = $@"
Bună ziua {message.Name},

Mulțumim pentru mesajul dumneavoastră. Iată răspunsul nostru:

{responseText}

Cu stimă,
Echipa Mateos

---
Mesajul dvs. original:
Subiect: {message.Subject}
{message.Message}
";

        // Отправка через EmailServiceFactory или напрямую
        var emailService = _emailServiceFactory.CreateEmailService();
        await emailService.SendEmailAsync(
            message.Email, 
            $"Re: {message.Subject}", 
            emailBody
        );

        _logger.LogInformation("Response email sent to {Email} for message {MessageId}", 
            message.Email, messageId);

        return true;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to send response email for message {MessageId}", messageId);
        return false;
    }
}
```

**Проверка**:
```bash
curl -X POST "https://localhost:7001/contact/MESSAGE_ID/respond" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"response":"Vă mulțumim pentru mesaj. Vă vom contacta în curând."}'
```

---

## 🔧 Fix #3: Student Registration Routes

### Файл: `StudentRegistrationController.cs`

### Добавить альтернативные routes для совместимости:

```csharp
/// <summary>
/// Получить все регистрации - альтернативный route для frontend
/// </summary>
[HttpGet("all")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<List<StudentRegistrationViewDto>>> GetAllRegistrationsSimple()
{
    try
    {
        // Возвращаем все без пагинации для совместимости
        var pagination = new PaginationDto { Page = 1, PageSize = 1000 };
        var result = await _studentRegistrationService.GetAllRegistrationsAsync(
            pagination, null, null, null);
        
        return Ok(result.Items);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting all registrations");
        return StatusCode(500, new { message = "Ошибка при получении регистраций" });
    }
}

/// <summary>
/// Получить регистрации с пагинацией - альтернативный route
/// </summary>
[HttpGet("paged")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<PagedResult<StudentRegistrationViewDto>>> GetRegistrationsPaged(
    [FromQuery] PaginationDto pagination)
{
    try
    {
        var result = await _studentRegistrationService.GetAllRegistrationsAsync(
            pagination, null, null, null);
        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting paged registrations");
        return StatusCode(500, new { message = "Ошибка при получении регистраций" });
    }
}

/// <summary>
/// Получить ожидающие регистрации
/// </summary>
[HttpGet("pending")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<List<StudentRegistrationViewDto>>> GetPendingRegistrations()
{
    try
    {
        var pagination = new PaginationDto { Page = 1, PageSize = 1000 };
        var result = await _studentRegistrationService.GetAllRegistrationsAsync(
            pagination, StudentRegistrationStatus.Pending, null, null);
        
        return Ok(result.Items);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting pending registrations");
        return StatusCode(500, new { message = "Ошибка при получении ожидающих регистраций" });
    }
}

/// <summary>
/// Одобрить регистрацию студента - упрощенный endpoint
/// </summary>
[HttpPost("{id}/approve")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> ApproveRegistrationSimple(Guid id, [FromBody] ApproveRegistrationDto dto)
{
    try
    {
        var userId = GetCurrentUserId();
        
        var updateDto = new UpdateStudentRegistrationDto
        {
            Status = StudentRegistrationStatus.Approved,
            AdminNotes = dto.Notes,
            ReviewedBy = userId
        };

        var success = await _studentRegistrationService.UpdateRegistrationStatusAsync(
            id, updateDto, userId);

        if (!success)
            return NotFound(new { message = "Регистрация не найдена" });

        // Можно добавить создание учетной записи студента здесь
        // await _studentRegistrationService.CreateStudentAccountAsync(id);

        return Ok(new { 
            success = true,
            message = "Регистрация одобрена успешно" 
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error approving registration {RegistrationId}", id);
        return StatusCode(500, new { message = "Ошибка при одобрении регистрации" });
    }
}

/// <summary>
/// Отклонить регистрацию студента - упрощенный endpoint
/// </summary>
[HttpPost("{id}/reject")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> RejectRegistrationSimple(Guid id, [FromBody] RejectRegistrationDto dto)
{
    try
    {
        var userId = GetCurrentUserId();
        
        var updateDto = new UpdateStudentRegistrationDto
        {
            Status = StudentRegistrationStatus.Rejected,
            AdminNotes = dto.Notes,
            ReviewedBy = userId
        };

        var success = await _studentRegistrationService.UpdateRegistrationStatusAsync(
            id, updateDto, userId);

        if (!success)
            return NotFound(new { message = "Регистрация не найдена" });

        return Ok(new { 
            success = true,
            message = "Регистрация отклонена" 
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error rejecting registration {RegistrationId}", id);
        return StatusCode(500, new { message = "Ошибка при отклонении регистрации" });
    }
}
```

### Создать DTOs:

```csharp
// В BusinessLayer/DTOs/StudentRegistrationDtos.cs
public class ApproveRegistrationDto
{
    public string? Notes { get; set; }
}

public class RejectRegistrationDto
{
    public string? Notes { get; set; }
}
```

---

## 🔧 Fix #4: Teacher Applications Body Format

### Файл: `TeacherApplicationController.cs`

### Создать DTOs:

```csharp
// В BusinessLayer/DTOs/TeacherApplicationDtos.cs
public class ApproveApplicationDto
{
    [StringLength(500)]
    public string? Notes { get; set; }
}

public class RejectApplicationDto
{
    [StringLength(500)]
    public string? Notes { get; set; }
}
```

### Изменить методы в `TeacherApplicationController.cs`:

**Было**:
```csharp
[HttpPost("{id:guid}/approve")]
public async Task<IActionResult> ApproveApplication(Guid id, [FromBody] string? notes = null)
```

**Стало**:
```csharp
/// <summary>
/// Одобрение заявки (только для админов)
/// </summary>
[HttpPost("{id:guid}/approve")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> ApproveApplication(
    Guid id, 
    [FromBody] ApproveApplicationDto dto)
{
    try
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var result = await _teacherApplicationService.ApproveApplicationAsync(
            id, userId.Value, dto.Notes);
            
        if (!result)
        {
            return NotFound(new { message = "Cererea nu a fost găsită sau nu poate fi aprobată." });
        }

        return Ok(new { 
            success = true,
            message = "Cererea a fost aprobată cu succes. Contul de profesor a fost creat." 
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error approving teacher application: {ApplicationId}", id);
        return StatusCode(500, new { message = "A apărut o eroare la aprobarea cererii." });
    }
}
```

### Аналогично для Reject:

```csharp
/// <summary>
/// Отклонение заявки (только для админов)
/// </summary>
[HttpPost("{id:guid}/reject")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> RejectApplication(
    Guid id, 
    [FromBody] RejectApplicationDto dto)
{
    try
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var result = await _teacherApplicationService.RejectApplicationAsync(
            id, userId.Value, dto.Notes);
            
        if (!result)
        {
            return NotFound(new { message = "Cererea nu a fost găsită." });
        }

        return Ok(new { 
            success = true,
            message = "Cererea a fost respinsă." 
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error rejecting teacher application: {ApplicationId}", id);
        return StatusCode(500, new { message = "A apărut o eroare la respingerea cererii." });
    }
}
```

---

## 🔧 Fix #5: Contact Status Update - PATCH Support

### Опция A: Добавить дополнительный PATCH endpoint

```csharp
// В ContactController.cs
/// <summary>
/// Обновление статуса сообщения через PATCH (для совместимости с frontend)
/// </summary>
[HttpPatch("{id:guid}/status")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> PatchMessageStatus(
    Guid id, 
    [FromBody] UpdateContactStatusDto dto)
{
    // Перенаправляем на существующий PUT endpoint
    return await UpdateMessageStatus(id, dto.Status);
}
```

### Опция B: Изменить существующий на MapMethods

```csharp
// Вместо [HttpPut] использовать:
[HttpPut("{id:guid}/status")]
[HttpPatch("{id:guid}/status")]  // Добавить поддержку PATCH
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateMessageStatus(...)
```

---

## 🔧 Fix #6: Roles Unification

### Проверить в `AuthController.cs` генерацию JWT:

```csharp
// Убедиться что используется "Administrator" а не "Admin"
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Role)  // ← Должно быть "Administrator"
};
```

### Заменить все вхождения в контроллерах:

```bash
# Поиск всех [Authorize(Roles = "Admin")]
# Заменить на [Authorize(Roles = "Administrator")]
```

**Или** создать константу:

```csharp
// В Constants/Roles.cs
public static class Roles
{
    public const string Administrator = "Administrator";
    public const string Teacher = "Teacher";
    public const string Student = "Student";
    public const string Parent = "Parent";
}

// Использование:
[Authorize(Roles = Roles.Administrator)]
```

---

## ✅ Checklist после изменений

### Backend
- [ ] Добавлен endpoint `GET /Groups/generate-name/{class}`
- [ ] Добавлен endpoint `POST /contact/{id}/respond`
- [ ] Добавлены альтернативные routes для StudentRegistration
- [ ] Исправлены DTOs для Teacher Applications
- [ ] Добавлена поддержка PATCH для Contact status
- [ ] Унифицированы роли во всех контроллерах
- [ ] Запущены unit tests
- [ ] Проверены все endpoints через Postman/Swagger

### Database
- [ ] Применены необходимые миграции (если есть)
- [ ] Проверены права доступа для новых endpoints

### Documentation
- [ ] Обновлена документация API
- [ ] Добавлены примеры запросов

---

## 🧪 Тестирование

### Скрипт для тестирования всех изменений:

```bash
#!/bin/bash
API_URL="https://localhost:7001"
TOKEN="YOUR_ADMIN_JWT_TOKEN"

# Test Generate Group Name
echo "Testing Generate Group Name..."
curl -X GET "$API_URL/Groups/generate-name/5A" \
  -H "Authorization: Bearer $TOKEN"

# Test Respond to Contact
echo -e "\n\nTesting Respond to Contact..."
curl -X POST "$API_URL/contact/CONTACT_ID/respond" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"response":"Test response"}'

# Test Student Registration Approve
echo -e "\n\nTesting Approve Registration..."
curl -X POST "$API_URL/StudentRegistration/REG_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Approved for testing"}'

# Test Teacher Application Approve
echo -e "\n\nTesting Approve Teacher Application..."
curl -X POST "$API_URL/teacher-applications/APP_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Approved"}'

echo -e "\n\nAll tests completed!"
```

---

## 📞 Нужна помощь?

Если возникнут вопросы при реализации, проверьте:
1. Логи backend: `dotnet watch` output
2. Swagger UI: `https://localhost:7001/swagger`
3. Network tab в браузере для frontend запросов
4. Database logs для SQL queries
