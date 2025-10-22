#!/bin/bash

# Complete final fix for all remaining errors
echo "Complete final fix..."

# Fix ConsentManagementPanel.tsx
sed -i '' 's/"granted"/"Granted"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/"withdrawn"/"Withdrawn"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.timestamp/history.performedAt/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.reason/history.notes/g' src/components/gdpr/ConsentManagementPanel.tsx

# Fix MyGroupsPanel.tsx
sed -i '' 's/nextLesson\./nextLesson?./g' src/components/student/MyGroupsPanel.tsx

# Fix AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.firstname/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.lastname/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.phone/application.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Google Analytics", purpose: "Website analytics" }/{ name: "Google Analytics", purpose: "Website analytics", dataShared: ["IP address", "browser info"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Stripe", purpose: "Payment processing" }/{ name: "Stripe", purpose: "Payment processing", dataShared: ["payment info", "billing address"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx

# Fix TeacherApplicationPage.tsx
sed -i '' 's/name="firstname"/name="firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="lastname"/name="lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="phone"/name="phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix boolean undefined issue
sed -i '' 's/agreedToDataProcessing: agreedToDataProcessing,/agreedToDataProcessing: agreedToDataProcessing || false,/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix undefined checks
sed -i '' 's/formData\.motivation/formData.motivation || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.teachingMethodology/formData.teachingMethodology || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.preferredAgeGroups/formData.preferredAgeGroups || []/g' src/pages/teacher/TeacherApplicationPage.tsx

echo "Complete final fix completed"
