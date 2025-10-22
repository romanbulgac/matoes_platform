#!/bin/bash
# Fix final complet pentru toate erorile rămase

cd "$(dirname "$0")"

echo "🔧 Fix final complet pentru toate erorile rămase..."

# 1. Fix AdminTeacherApplicationsPage - proprietăți lipsă
echo "📝 Fixare AdminTeacherApplicationsPage - proprietăți lipsă..."
sed -i '' \
  -e 's/application\.lastname/application.LastName/g' \
  -e 's/application\.phone/application.PhoneNumber/g' \
  -e 's/application\.education/application.Education/g' \
  -e 's/application\.motivation/application.Motivation/g' \
  -e 's/application\.teachingMethodology/application.TeachingMethodology/g' \
  -e 's/application\.reviewerNotes/application.ReviewNotes/g' \
  -e 's/application\.rejectionReason/application.RejectionReason/g' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx

# 2. Fix DataProcessingInfoPage - proprietăți corecte
echo "📝 Fixare DataProcessingInfoPage - proprietăți corecte..."
sed -i '' \
  -e 's/dataInfo\.controller/dataInfo.DataController/g' \
  src/pages/public/DataProcessingInfoPage.tsx

# 3. Fix TrackApplicationPage - TeacherApplicationViewDto
echo "📝 Fixare TrackApplicationPage - TeacherApplicationViewDto..."
sed -i '' \
  -e 's/application\.FirstName/application.FirstName/g' \
  -e 's/application\.LastName/application.LastName/g' \
  -e 's/application\.ReviewNotes/application.ReviewNotes/g' \
  -e 's/application\.RejectionReason/application.RejectionReason/g' \
  src/pages/public/TrackApplicationPage.tsx

# 4. Fix TeacherApplicationPage - TeacherApplicationDto complet
echo "📝 Fixare TeacherApplicationPage - TeacherApplicationDto complet..."
sed -i '' \
  -e 's/firstname: formData\.firstname/FirstName: formData.firstname/g' \
  -e 's/lastname: formData\.lastname/LastName: formData.lastname/g' \
  -e 's/formData\.FirstName/formData.FirstName/g' \
  -e 's/formData\.LastName/formData.LastName/g' \
  -e 's/formData\.PhoneNumber/formData.PhoneNumber/g' \
  -e 's/formData\.DateOfBirth/formData.DateOfBirth/g' \
  -e 's/formData\.Education/formData.Education/g' \
  -e 's/formData\.Motivation/formData.Motivation/g' \
  -e 's/formData\.TeachingMethodology/formData.TeachingMethodology/g' \
  -e 's/formData\.AvailableHours/formData.AvailableHours/g' \
  -e 's/formData\.AgreedToDataProcessing/formData.AgreedToDataProcessing/g' \
  -e 's/\"firstname\"/\"FirstName\"/g' \
  -e 's/\"lastname\"/\"LastName\"/g' \
  -e 's/\"phone\"/\"PhoneNumber\"/g' \
  -e 's/\"dateOfBirth\"/\"DateOfBirth\"/g' \
  -e 's/\"education\"/\"Education\"/g' \
  -e 's/\"motivation\"/\"Motivation\"/g' \
  -e 's/\"teachingMethodology\"/\"TeachingMethodology\"/g' \
  -e 's/\"availableHours\"/\"AvailableHours\"/g' \
  -e 's/\"agreedToDataProcessing\"/\"AgreedToDataProcessing\"/g' \
  src/pages/teacher/TeacherApplicationPage.tsx

# 5. Fix consentService - proprietăți PascalCase
echo "📝 Fixare consentService - proprietăți PascalCase..."
sed -i '' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  src/services/consentService.ts

echo "✅ Fix final complet terminat!"
