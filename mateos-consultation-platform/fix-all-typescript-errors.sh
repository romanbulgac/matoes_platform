#!/bin/bash
# Script pentru fixarea automată a TUTUROR erorilor TypeScript

cd "$(dirname "$0")"

echo "🔧 Fixare erori TypeScript în progres..."

# Fix 1: UserDto PascalCase -> camelCase în consultation-details/
echo "📝 Fixare UserDto în consultation-details..."
find src/components/consultation-details -name "*.tsx" -type f -exec sed -i '' \
  -e 's/student\.id/student.Id/g' \
  -e 's/student\.name/student.Name/g' \
  -e 's/student\.surname/student.Surname/g' \
  -e 's/student\.email/student.Email/g' \
  -e 's/student\.phoneNumber/student.PhoneNumber/g' \
  -e 's/p\.id/p.Id/g' \
  -e 's/p\.name/p.Name/g' \
  -e 's/p\.surname/p.Surname/g' \
  -e 's/p\.email/p.Email/g' \
  {} \;

# Fix 2: ParentDashboard firstName/lastName
echo "📝 Fixare ParentDashboard..."
sed -i '' \
  -e 's/user?.firstName/user?.firstname/g' \
  -e 's/user?.lastName/user?.lastname/g' \
  src/components/dashboards/ParentDashboard.tsx

# Fix 3: StudentWithSubscription firstName/lastName
echo "📝 Fixare EnrollmentDialog..."
sed -i '' \
  -e 's/student\.firstName/student.firstname/g' \
  -e 's/student\.lastName/student.lastname/g' \
  src/components/groups/EnrollmentDialog.tsx

sed -i '' \
  -e 's/member\.firstName/member.firstname/g' \
  src/components/student/MyGroupsPanel.tsx

# Fix 4: TeacherCard PascalCase
echo "📝 Fixare TeacherCard..."
sed -i '' \
  -e 's/teacher\.name/teacher.Name/g' \
  -e 's/teacher\.surname/teacher.Surname/g' \
  -e 's/teacher\.profilePicture/teacher.ProfilePicture/g' \
  -e 's/teacher\.id/teacher.Id/g' \
  src/components/teachers/TeacherCard.tsx

sed -i '' \
  -e 's/teacher\.id/teacher.Id/g' \
  src/pages/TeachersPage.tsx

# Fix 5: IndividualStudents
echo "📝 Fixare IndividualStudents..."
sed -i '' \
  -e 's/studentParticipant?.name/studentParticipant?.Name/g' \
  -e 's/studentParticipant?.surname/studentParticipant?.Surname/g' \
  -e 's/studentParticipant?.email/studentParticipant?.Email/g' \
  src/components/teacher/IndividualStudents.tsx

# Fix 6: AcceptInvitationPage
echo "📝 Fixare AcceptInvitationPage..."
sed -i '' \
  -e 's/result\.user\.id/result.user.Id/g' \
  -e 's/result\.user\.email/result.user.Email/g' \
  -e 's/result\.user\.name/result.user.Name/g' \
  -e 's/result\.user\.surname/result.user.Surname/g' \
  -e 's/result\.user\.phoneNumber/result.user.PhoneNumber/g' \
  -e 's/result\.user\.role/result.user.Role/g' \
  src/pages/AcceptInvitationPage.tsx

# Fix 7: GeneralInfoTab
echo "📝 Fixare GeneralInfoTab..."
sed -i '' \
  -e 's/name: formData\.firstname/Name: formData.firstname/g' \
  src/components/profile/tabs/GeneralInfoTab.tsx

echo "✅ Toate fix-urile automate au fost aplicate!"
echo "🔍 Rulează 'npm run build' pentru a verifica..."

