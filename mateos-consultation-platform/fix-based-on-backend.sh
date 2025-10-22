#!/bin/bash
# Fix complet bazat pe structura backend-ului real

cd "$(dirname "$0")"

echo "🔧 Fixare completă bazată pe backend-ul real..."

# BACKEND STRUCTURE ANALYSIS:
# 1. UserDto: PascalCase (Id, Name, Surname, Email, PhoneNumber, Role, etc.)
# 2. TeacherApplicationDto: PascalCase (FirstName, LastName, Email, PhoneNumber, etc.)
# 3. ConsentDto: Nu există în backend - folosim UserConsentDto din frontend
# 4. DataProcessingInfoDto: PascalCase (DataController, DpoEmail, etc.)

echo "📝 Fixare UserDto - Backend folosește PascalCase..."
# Fix toate referințele la UserDto să folosească PascalCase
find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i '' \
  -e 's/student\.Id/student.Id/g' \
  -e 's/student\.Name/student.Name/g' \
  -e 's/student\.Surname/student.Surname/g' \
  -e 's/student\.Email/student.Email/g' \
  -e 's/student\.PhoneNumber/student.PhoneNumber/g' \
  -e 's/p\.Id/p.Id/g' \
  -e 's/p\.Name/p.Name/g' \
  -e 's/p\.Surname/p.Surname/g' \
  -e 's/p\.Email/p.Email/g' \
  -e 's/teacher\.Id/teacher.Id/g' \
  -e 's/teacher\.Name/teacher.Name/g' \
  -e 's/teacher\.Surname/teacher.Surname/g' \
  -e 's/teacher\.ProfilePicture/teacher.ProfilePicture/g' \
  -e 's/result\.user\.Id/result.user.Id/g' \
  -e 's/result\.user\.Email/result.user.Email/g' \
  -e 's/result\.user\.Name/result.user.Name/g' \
  -e 's/result\.user\.Surname/result.user.Surname/g' \
  -e 's/result\.user\.PhoneNumber/result.user.PhoneNumber/g' \
  -e 's/result\.user\.Role/result.user.Role/g'

echo "📝 Fixare TeacherApplicationDto - Backend folosește PascalCase..."
# Fix TeacherApplicationDto să folosească PascalCase
find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i '' \
  -e 's/application\.firstName/application.FirstName/g' \
  -e 's/application\.lastName/application.LastName/g' \
  -e 's/application\.phoneNumber/application.PhoneNumber/g' \
  -e 's/application\.email/application.Email/g' \
  -e 's/selectedApplication\.firstName/selectedApplication.FirstName/g' \
  -e 's/selectedApplication\.lastName/selectedApplication.LastName/g' \
  -e 's/formData\.firstname/formData.FirstName/g' \
  -e 's/formData\.lastname/formData.LastName/g' \
  -e 's/formData\.phone/formData.PhoneNumber/g'

echo "📝 Fixare AdminDashboard - proprietăți opționale..."
# Fix AdminDashboard să trateze proprietățile ca opționale
sed -i '' \
  -e 's/stats\.underfilledGroups > 0/stats.underfilledGroups \&\& stats.underfilledGroups > 0/g' \
  -e 's/stats\.inactiveTeachers > 0/stats.inactiveTeachers \&\& stats.inactiveTeachers > 0/g' \
  -e 's/stats\.expiredConsents > 0/stats.expiredConsents \&\& stats.expiredConsents > 0/g' \
  src/components/dashboards/AdminDashboard.tsx

echo "📝 Fixare GeneralInfoTab - UserDto PascalCase..."
sed -i '' \
  -e 's/Name: formData\.firstname/Name: formData.firstname/g' \
  -e 's/surname: formData\.lastname/Surname: formData.lastname/g' \
  src/components/profile/tabs/GeneralInfoTab.tsx

echo "📝 Fixare MyGroupsPanel - upcomingConsultations..."
sed -i '' \
  -e 's/group\.upcomingConsultations\.length/Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations.length : 0/g' \
  -e 's/group\.upcomingConsultations\[0\]/Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations[0] : null/g' \
  src/components/student/MyGroupsPanel.tsx

echo "📝 Fixare AdminGroupManagementPage - upcomingConsultations..."
sed -i '' \
  -e 's/group\.upcomingConsultations \|\| 0/Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations.length : (typeof group.upcomingConsultations === \"number\" ? group.upcomingConsultations : 0)/g' \
  src/pages/admin/AdminGroupManagementPage.tsx

echo "📝 Fixare TeacherApplicationPage - proprietăți lipsă..."
# Adaugă proprietățile lipsă în TeacherApplicationDto
cat > /tmp/fix-teacher-app-props.txt << 'EOF'
sed -i '' \
  -e 's/formData\.phone/formData.PhoneNumber/g' \
  -e 's/formData\.dateOfBirth/formData.DateOfBirth/g' \
  -e 's/formData\.education/formData.Education/g' \
  -e 's/formData\.motivation/formData.Motivation/g' \
  -e 's/formData\.teachingMethodology/formData.TeachingMethodology/g' \
  -e 's/formData\.availableHours/formData.AvailableHours/g' \
  -e 's/formData\.agreedToDataProcessing/formData.AgreedToDataProcessing/g' \
  src/pages/teacher/TeacherApplicationPage.tsx
EOF
bash /tmp/fix-teacher-app-props.txt

echo "📝 Fixare AdminTeacherApplicationsPage - proprietăți lipsă..."
# Fix proprietățile lipsă în TeacherApplicationViewDto
sed -i '' \
  -e 's/application\.phone/application.PhoneNumber/g' \
  -e 's/application\.education/application.Education/g' \
  -e 's/application\.motivation/application.Motivation/g' \
  -e 's/application\.teachingMethodology/application.TeachingMethodology/g' \
  -e 's/application\.reviewerNotes/application.ReviewNotes/g' \
  -e 's/application\.rejectionReason/application.RejectionReason/g' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx

echo "📝 Fixare TrackApplicationPage - proprietăți lipsă..."
sed -i '' \
  -e 's/application\.reviewerNotes/application.ReviewNotes/g' \
  -e 's/application\.rejectionReason/application.RejectionReason/g' \
  src/pages/public/TrackApplicationPage.tsx

echo "📝 Fixare DataProcessingInfoPage - proprietăți lipsă..."
# Fix DataProcessingInfoDto să folosească proprietățile corecte
sed -i '' \
  -e 's/dataInfo\.controller/dataInfo.DataController/g' \
  -e 's/dataInfo\.contactEmail/dataInfo.DpoEmail/g' \
  -e 's/dataInfo\.dataProtectionOfficer/dataInfo.DpoEmail/g' \
  -e 's/dataInfo\.dataRetentionPeriods/dataInfo.RetentionPeriods/g' \
  src/pages/public/DataProcessingInfoPage.tsx

echo "📝 Fixare ConsentManagementPanel - proprietăți lipsă..."
# Fix ConsentDto să folosească proprietățile corecte
sed -i '' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  -e 's/history\.consentType/history.ConsentType/g' \
  -e 's/history\.timestamp/history.PerformedAt/g' \
  -e 's/history\.reason/history.Notes/g' \
  -e 's/purpose\.dataTypes/purpose.DataTypes/g' \
  -e 's/purpose\.retentionPeriod/purpose.RetentionPeriodDays/g' \
  -e 's/action === \"granted\"/action === \"Granted\"/g' \
  -e 's/action === \"withdrawn\"/action === \"Withdrawn\"/g' \
  src/components/gdpr/ConsentManagementPanel.tsx

echo "📝 Fixare consentService - proprietăți lipsă..."
sed -i '' \
  -e 's/consent\.consentType/consent.ConsentType/g' \
  -e 's/consent\.isGranted/consent.IsGranted/g' \
  src/services/consentService.ts

echo "📝 Fixare AdminTeacherApplicationsPage - TeacherApplicationApprovalDto..."
# Fix TeacherApplicationApprovalDto să nu aibă proprietatea notes
sed -i '' \
  -e 's/notes: reviewNotes,//' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx

# Fix TeacherApplicationRejectionDto să nu aibă proprietatea reason
sed -i '' \
  -e 's/reason: rejectionReason,//' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx

echo "✅ Fix-uri complete bazate pe backend-ul real!"

