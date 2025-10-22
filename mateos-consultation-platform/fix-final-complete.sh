#!/bin/bash
# Fix final complet pentru toate erorile rămase

cd "$(dirname "$0")"

echo "🔧 Fix final complet..."

# Fix RegisterPage - PhoneNumberNumber -> PhoneNumber
sed -i '' \
  -e 's/PhoneNumberNumber/PhoneNumber/g' \
  src/pages/auth/RegisterPage.tsx

# Fix StudentRegistrationPage - FirstName/LastName -> firstname/lastname
sed -i '' \
  -e 's/formData\.FirstName/formData.firstname/g' \
  -e 's/formData\.LastName/formData.lastname/g' \
  -e 's/formData\.PhoneNumber/formData.phone/g' \
  src/pages/auth/StudentRegistrationPage.tsx

# Fix DataProcessingInfoPage - proprietăți corecte
sed -i '' \
  -e 's/dataInfo\.controller/dataInfo.DataController/g' \
  -e 's/dataInfo\.purposes/dataInfo.ProcessingPurposes/g' \
  -e 's/dataInfo\.thirdParties/dataInfo.ThirdParties/g' \
  -e 's/dataInfo\.userRights/dataInfo.UserRights/g' \
  src/pages/public/DataProcessingInfoPage.tsx

# Fix TeacherApplicationPage - proprietăți corecte
sed -i '' \
  -e 's/formData\.PhoneNumber/formData.phone/g' \
  src/pages/public/TeacherApplicationPage.tsx

# Fix TrackApplicationPage - proprietăți corecte
sed -i '' \
  -e 's/application\.firstname/application.FirstName/g' \
  -e 's/application\.lastname/application.LastName/g' \
  -e 's/application\.ReviewNotes/application.ReviewNotes/g' \
  -e 's/application\.RejectionReason/application.RejectionReason/g' \
  src/pages/public/TrackApplicationPage.tsx

# Fix TeacherApplicationPage - proprietăți corecte
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

# Fix consentService - proprietăți corecte
sed -i '' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  src/services/consentService.ts

echo "✅ Fix final complet!"

