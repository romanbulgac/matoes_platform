#!/bin/bash
# Fix complet și sistematic pentru TOATE erorile rămase

cd "$(dirname "$0")"

echo "🔧 Fix complet și sistematic pentru TOATE erorile rămase..."

# 1. Fix ConsentManagementPanel - toate proprietățile PascalCase
echo "📝 Fixare ConsentManagementPanel - toate proprietățile PascalCase..."
sed -i '' \
  -e 's/history\.consentType/history.ConsentType/g' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  -e 's/history\.id/history.Id/g' \
  -e 's/history\.action/history.Action/g' \
  -e 's/history\.timestamp/history.PerformedAt/g' \
  -e 's/history\.reason/history.Notes/g' \
  src/components/gdpr/ConsentManagementPanel.tsx

# 2. Fix GeneralInfoTab - UserDto PascalCase
echo "📝 Fixare GeneralInfoTab - UserDto PascalCase..."
sed -i '' \
  -e 's/surname: formData\.lastname/Surname: formData.lastname/g' \
  src/components/profile/tabs/GeneralInfoTab.tsx

# 3. Fix MyGroupsPanel - upcomingConsultations
echo "📝 Fixare MyGroupsPanel - upcomingConsultations..."
sed -i '' \
  -e 's/group\.upcomingConsultations \&\& Array\.isArray(group\.upcomingConsultations) \&\& group\.upcomingConsultations\.length/group.upcomingConsultations \&\& Array.isArray(group.upcomingConsultations) \&\& group.upcomingConsultations.length/g' \
  -e 's/const nextLesson = Array\.isArray(group\.upcomingConsultations) ? group\.upcomingConsultations\[0\] : null;/const nextLesson = Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations[0] : null;/g' \
  src/components/student/MyGroupsPanel.tsx

# 4. Fix AdminTeacherApplicationsPage - TeacherApplicationViewDto
echo "📝 Fixare AdminTeacherApplicationsPage - TeacherApplicationViewDto..."
sed -i '' \
  -e 's/application\.firstname/application.FirstName/g' \
  -e 's/application\.lastname/application.LastName/g' \
  -e 's/application\.FirstName/application.FirstName/g' \
  -e 's/application\.LastName/application.LastName/g' \
  -e 's/application\.Email/application.Email/g' \
  -e 's/application\.phone/application.PhoneNumber/g' \
  -e 's/application\.education/application.Education/g' \
  -e 's/application\.motivation/application.Motivation/g' \
  -e 's/application\.teachingMethodology/application.TeachingMethodology/g' \
  -e 's/application\.reviewerNotes/application.ReviewNotes/g' \
  -e 's/application\.rejectionReason/application.RejectionReason/g' \
  -e 's/notes: reviewNotes,//' \
  -e 's/reviewerNotes: rejectionReason,//' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx

# 5. Fix DataProcessingInfoPage - proprietăți corecte
echo "📝 Fixare DataProcessingInfoPage - proprietăți corecte..."
sed -i '' \
  -e 's/dataInfo\.controller/dataInfo.DataController/g' \
  src/pages/public/DataProcessingInfoPage.tsx

# 6. Fix TrackApplicationPage - TeacherApplicationViewDto
echo "📝 Fixare TrackApplicationPage - TeacherApplicationViewDto..."
sed -i '' \
  -e 's/application\.FirstName/application.FirstName/g' \
  -e 's/application\.LastName/application.LastName/g' \
  -e 's/application\.ReviewNotes/application.ReviewNotes/g' \
  -e 's/application\.RejectionReason/application.RejectionReason/g' \
  src/pages/public/TrackApplicationPage.tsx

# 7. Fix TeacherApplicationPage - TeacherApplicationDto complet
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

# 8. Fix consentService - proprietăți PascalCase
echo "📝 Fixare consentService - proprietăți PascalCase..."
sed -i '' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  src/services/consentService.ts

echo "✅ Fix complet și sistematic terminat!"

