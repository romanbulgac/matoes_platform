#!/bin/bash

# Final fix for last 4 errors
echo "Final fix for last 4 errors..."

# Fix AdminTeacherApplicationsPage.tsx
sed -i '' 's/selectedApplication\.phone/selectedApplication.phoneNumber/g' src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Google Analytics", purpose: "Website analytics" }/{ name: "Google Analytics", purpose: "Website analytics", dataShared: ["IP address", "browser info"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Stripe", purpose: "Payment processing" }/{ name: "Stripe", purpose: "Payment processing", dataShared: ["payment info", "billing address"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx

# Fix TeacherApplicationPage.tsx
sed -i '' 's/formData\.preferredAgeGroups/formData.preferredAgeGroups || []/g' src/pages/teacher/TeacherApplicationPage.tsx

echo "Final fix completed"
