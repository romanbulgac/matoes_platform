#!/bin/bash

# Final comprehensive fix for all remaining camelCase issues
echo "Final comprehensive fix..."

# Fix AcceptInvitationPage.tsx
sed -i '' 's/result\.user\.role/result.user.role/g' src/pages/AcceptInvitationPage.tsx

# Fix AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.firstname/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.lastname/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.FirstName/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.LastName/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.Email/application.email/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.phone/application.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix TeacherApplicationApprovalDto and TeacherApplicationRejectionDto
sed -i '' 's/notes: /reviewerNotes: /g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/reviewerNotes: /reviewerNotes: /g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.DataController/dataInfo.dataController/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.ProcessingPurposes/dataInfo.processingPurposes/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.RetentionPeriods/dataInfo.retentionPeriods/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.ThirdParties/dataInfo.thirdParties/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/dataInfo\.UserRights/dataInfo.userRights/g' src/pages/public/DataProcessingInfoPage.tsx

# Fix TeacherApplicationPage.tsx initial state completely
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

echo "Final comprehensive fix completed"
