#!/bin/bash

# Ultimate final fix for all remaining issues
echo "Ultimate final fix..."

# Fix ConsentManagementPanel.tsx
sed -i '' 's/"granted"/"Granted"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/"withdrawn"/"Withdrawn"/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.timestamp/history.performedAt/g' src/components/gdpr/ConsentManagementPanel.tsx
sed -i '' 's/history\.reason/history.notes/g' src/components/gdpr/ConsentManagementPanel.tsx

# Fix IndividualStudents.tsx
sed -i '' 's/participant\.Id/participant.id/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Name/participant.name/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Surname/participant.surname/g' src/components/teacher/IndividualStudents.tsx
sed -i '' 's/participant\.Email/participant.email/g' src/components/teacher/IndividualStudents.tsx

# Fix AdminTeacherApplicationsPage.tsx
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

# Fix DataProcessingInfoPage.tsx - add missing properties
sed -i '' 's/{ name: "Google Analytics", purpose: "Website analytics" }/{ name: "Google Analytics", purpose: "Website analytics", dataShared: ["IP address", "browser info"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Stripe", purpose: "Payment processing" }/{ name: "Stripe", purpose: "Payment processing", dataShared: ["payment info", "billing address"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx

echo "Ultimate final fix completed"
