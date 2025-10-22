#!/bin/bash

# Final fix for last 9 errors
echo "Final fix for last 9 errors..."

# Fix DataProcessingInfoPage.tsx - add missing properties
sed -i '' 's/{ name: "Google Analytics", purpose: "Website analytics" }/{ name: "Google Analytics", purpose: "Website analytics", dataShared: ["IP address", "browser info"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx
sed -i '' 's/{ name: "Stripe", purpose: "Payment processing" }/{ name: "Stripe", purpose: "Payment processing", dataShared: ["payment info", "billing address"], location: "USA" }/g' src/pages/public/DataProcessingInfoPage.tsx

# Fix TeacherApplicationPage.tsx form field names
sed -i '' 's/name="firstname"/name="firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="lastname"/name="lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="phone"/name="phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix boolean undefined issue
sed -i '' 's/agreedToDataProcessing: agreedToDataProcessing,/agreedToDataProcessing: agreedToDataProcessing || false,/g' src/pages/teacher/TeacherApplicationPage.tsx

# Fix undefined checks
sed -i '' 's/formData\.motivation/formData.motivation || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.teachingMethodology/formData.teachingMethodology || ""/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/formData\.preferredAgeGroups/formData.preferredAgeGroups || []/g' src/pages/teacher/TeacherApplicationPage.tsx

echo "Final fix completed"
