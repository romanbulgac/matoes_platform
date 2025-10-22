#!/bin/bash

# Fix TeacherApplicationPage.tsx to use camelCase properties
echo "Fixing TeacherApplicationPage.tsx..."

# Replace PascalCase with camelCase in TeacherApplicationPage.tsx
sed -i '' 's/formData\.FirstName/formData.firstName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.LastName/formData.lastName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.PhoneNumber/formData.phoneNumber/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.DateOfBirth/formData.dateOfBirth/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.Education/formData.education/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.Motivation/formData.motivation/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.TeachingMethodology/formData.teachingMethodology/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.AvailableHours/formData.availableHours/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.AgreedToDataProcessing/formData.agreedToDataProcessing/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix form field names
sed -i '' 's/"firstname"/"firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"lastname"/"lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"phone"/"phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"dateOfBirth"/"dateOfBirth"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"education"/"education"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"motivation"/"motivation"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"teachingMethodology"/"teachingMethodology"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"availableHours"/"availableHours"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"agreedToDataProcessing"/"agreedToDataProcessing"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix TeachersPage.tsx
sed -i '' 's/teacher\.Id/teacher.id/g' src/pages/TeachersPage.tsx

echo "Fixed TeacherApplicationPage.tsx and TeachersPage.tsx"
