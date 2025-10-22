#!/bin/bash

# Systematic fix for all PascalCase to camelCase conversions
echo "Systematic PascalCase to camelCase conversion..."

# Fix all UserDto references
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/student\.Id/student.id/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/student\.Name/student.name/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/student\.Surname/student.surname/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/student\.Email/student.email/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/student\.PhoneNumber/student.phoneNumber/g'

find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/teacher\.Id/teacher.id/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/teacher\.Name/teacher.name/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/teacher\.Surname/teacher.surname/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/teacher\.ProfilePicture/teacher.profilePicture/g'

find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.Id/result.user.id/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.Email/result.user.email/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.Name/result.user.name/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.Surname/result.user.surname/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.PhoneNumber/result.user.phoneNumber/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/result\.user\.Role/result.user.role/g'

# Fix DataPurposeDto references
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.Id/purpose.id/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.Name/purpose.name/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.IsRequired/purpose.isRequired/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.Description/purpose.description/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.DataTypes/purpose.dataTypes/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.LegalBasis/purpose.legalBasis/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/purpose\.RetentionPeriodDays/purpose.retentionPeriodDays/g'

# Fix ConsentHistoryDto references
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/history\.timestamp/history.performedAt/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/history\.reason/history.notes/g'

# Fix action comparisons
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/"granted"/"Granted"/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/"withdrawn"/"Withdrawn"/g'

# Fix GeneralInfoTab.tsx
sed -i '' 's/Name: formData\.firstname/name: formData.firstname/g' src/components/profile/tabs/GeneralInfoTab.tsx
sed -i '' 's/Surname: formData\.lastname/surname: formData.lastname/g' src/components/profile/tabs/GeneralInfoTab.tsx

# Fix TeacherApplicationPage.tsx initial state
sed -i '' 's/firstname: firstName/firstName: firstName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/lastname: lastName/lastName: lastName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/phone: phoneNumber/phoneNumber: phoneNumber/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix form field names
sed -i '' 's/"firstname"/"firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"lastname"/"lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"phone"/"phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.firstname/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.lastname/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.phone/application.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix TeacherApplicationApprovalDto and TeacherApplicationRejectionDto
sed -i '' 's/reviewerNotes: /adminNotes: /g' src/pages/admin/AdminTeacherApplicationsPage.tsx

echo "Systematic PascalCase to camelCase conversion completed"
