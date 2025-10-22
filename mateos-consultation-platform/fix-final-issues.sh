#!/bin/bash

# Final fix for remaining issues
echo "Final fix for remaining issues..."

# Fix AdminTeacherApplicationsPage.tsx - remove duplicate adminNotes
sed -i '' '/adminNotes: /d' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix remaining firstname/lastname/phone references
sed -i '' 's/application\.firstname/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.lastname/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.phone/application.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix TeacherApplicationPage.tsx initial state
sed -i '' 's/firstname: firstName/firstName: firstName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/lastname: lastName/lastName: lastName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/phone: phoneNumber/phoneNumber: phoneNumber/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix form field names
sed -i '' 's/"firstname"/"firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"lastname"/"lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"phone"/"phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix boolean undefined issue
sed -i '' 's/agreedToDataProcessing: agreedToDataProcessing,/agreedToDataProcessing: agreedToDataProcessing || false,/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix undefined checks
sed -i '' 's/formData\.motivation/formData.motivation || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.teachingMethodology/formData.teachingMethodology || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.preferredAgeGroups/formData.preferredAgeGroups || []/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix DataProcessingInfoPage.tsx - remove dataTypes from ThirdPartyService
sed -i '' '/dataTypes: /d' src/pages/public/DataProcessingInfoPage.tsx

echo "Final fix completed"
