#!/bin/bash

# Final fix for the last 9 TypeScript errors
echo "Final fix for last 9 errors..."

# Fix form field names in TeacherApplicationPage.tsx
sed -i '' 's/"firstname"/"firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"lastname"/"lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/"phone"/"phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix boolean undefined issue
sed -i '' 's/agreedToDataProcessing: agreedToDataProcessing,/agreedToDataProcessing: agreedToDataProcessing || false,/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix undefined checks
sed -i '' 's/formData\.motivation/formData.motivation || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.teachingMethodology/formData.teachingMethodology || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.preferredAgeGroups/formData.preferredAgeGroups || []/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.firstname/application.firstName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.lastname/application.lastName/g' src/pages/admin/AdminTeacherApplicationsPage.tsx
sed -i '' 's/application\.phone/application.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix IndividualStudents.tsx
sed -i '' 's/participant\.Id/participant.id/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Name/participant.name/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Surname/participant.surname/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Email/participant.email/g' src/components/teacher/IndividualStudents.tsx

# Fix ConsentManagementPanel.tsx
sed -i '' 's/"granted"/"Granted"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/"withdrawn"/"Withdrawn"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.timestamp/history.performedAt/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.reason/history.notes/g' src/components/gdpr/ConsentManagementPanel.tsx

# Fix MyGroupsPanel.tsx
sed -i '' 's/group\.upcomingConsultations\.length/(Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations.length : 0)/g' src/components/student/MyGroupsPanel.tsx
sed -i '' 's/group\.upcomingConsultations\[0\]/(Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations[0] : null)/g' src/components/student/MyGroupsPanel.tsx

# Fix DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Google Analytics", purpose: "Website analytics" }/{ name: "Google Analytics", purpose: "Website analytics", dataShared: ["IP address", "browser info"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Stripe", purpose: "Payment processing" }/{ name: "Stripe", purpose: "Payment processing", dataShared: ["payment info", "billing address"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx

echo "Final fix completed"
