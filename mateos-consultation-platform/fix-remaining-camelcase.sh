#!/bin/bash

# Fix remaining camelCase issues
echo "Fixing remaining camelCase issues..."

# Fix DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.DpoEmail/dataInfo.dpoEmail/g' src/pages/public/DataProcessingInfoPage.tsx

# Fix TrackApplicationPage.tsx
sed -i '' 's/application\.FirstName/application.firstName/g' src/pages/public/TrackApplicationPage.tsx
sed -i '' 's/application\.LastName/application.lastName/g' src/pages/public/TrackApplicationPage.tsx
sed -i '' 's/application\.ReviewNotes/application.reviewerNotes/g' src/pages/public/TrackApplicationPage.tsx
sed -i '' 's/application\.RejectionReason/application.rejectionReason/g' src/pages/public/TrackApplicationPage.tsx

# Fix TeacherApplicationPage.tsx initial state
sed -i '' 's/firstname: firstName/firstName: firstName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/lastname: lastName/lastName: lastName/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/phone: phoneNumber/phoneNumber: phoneNumber/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/dateOfBirth: dateOfBirth/dateOfBirth: dateOfBirth/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/education: education/education: education/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/motivation: motivation/motivation: motivation/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/teachingMethodology: teachingMethodology/teachingMethodology: teachingMethodology/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/availableHours: availableHours/availableHours: availableHours/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/agreedToDataProcessing: agreedToDataProcessing/agreedToDataProcessing: agreedToDataProcessing/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix form field names in TeacherApplicationPage.tsx
sed -i '' 's/"firstname"/"firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"lastname"/"lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"phone"/"phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

echo "Fixed remaining camelCase issues"
