#!/bin/bash

echo "🔧 Fixing PascalCase → camelCase for all DTO fields..."

# Функция для безопасной замены
safe_replace() {
  local from=$1
  local to=$2
  local desc=$3
  
  echo "  Replacing: $from → $to ($desc)"
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/ui/*" \
    -exec sed -i '' "s/${from}/${to}/g" {} +
}

echo "📦 SubscriptionStatusDto..."
safe_replace '\.HasActiveSubscription' '.hasActiveSubscription' 'SubscriptionStatusDto'
safe_replace '\.IsInTrial' '.isInTrial' 'SubscriptionStatusDto'
safe_replace '\.CancelAtPeriodEnd' '.cancelAtPeriodEnd' 'SubscriptionStatusDto'
safe_replace '\.MaxConsultationsPerMonth' '.maxConsultationsPerMonth' 'SubscriptionStatusDto'
safe_replace '\.UnlimitedConsultations' '.unlimitedConsultations' 'SubscriptionStatusDto'
safe_replace '\.PlanName' '.planName' 'SubscriptionStatusDto'
safe_replace '\.TrialEnd' '.trialEnd' 'SubscriptionStatusDto'
safe_replace '\.CurrentPeriodEnd' '.currentPeriodEnd' 'SubscriptionStatusDto'
safe_replace '\.SubscriptionId' '.subscriptionId' 'SubscriptionStatusDto'
safe_replace '\.UserId' '.userId' 'SubscriptionStatusDto'

echo "👤 UserDto/TeacherWithStats..."
safe_replace '\.Id([^a-zA-Z])' '.id\1' 'User Id'
safe_replace '\.Name([^a-zA-Z])' '.name\1' 'User Name'
safe_replace '\.Surname([^a-zA-Z])' '.surname\1' 'User Surname'
safe_replace '\.Email([^a-zA-Z])' '.email\1' 'User Email'
safe_replace '\.ProfilePicture' '.profilePicture' 'User Profile'

echo "💳 SubscriptionPlanDto..."
safe_replace '\.Price([^a-zA-Z])' '.price\1' 'Plan Price'
safe_replace '\.Currency' '.currency' 'Plan Currency'
safe_replace '\.Interval' '.interval' 'Plan Interval'
safe_replace '\.Features' '.features' 'Plan Features'

echo "🔧 Lowercase typos (studentname → studentName)..."
safe_replace 'studentname:' 'studentName:' 'RegisterData'
safe_replace "'studentname'" "'studentName'" 'RegisterData'
safe_replace '\.teachername' '.teacherName' 'GroupDto'
safe_replace '\.childname' '.childName' 'InvitationDto'
safe_replace 'classname:' 'className:' 'Toast hook'
safe_replace 'groupname' 'groupName' 'SignalR/Services'
safe_replace '\.devicename' '.deviceName' 'DeviceInfoDto'

echo "🎯 Form field names (keep lowercase for backend)..."
safe_replace '\.parentEmail' '.parentemail' 'StudentRegistration'
safe_replace '\.parentName' '.parentname' 'StudentRegistration'
safe_replace '\.studentFullName' '.studentFullname' 'StudentRegistration'
safe_replace '\.parentFirstName' '.parentFirstname' 'StudentRegistration'
safe_replace '\.parentLastName' '.parentLastname' 'StudentRegistration'
safe_replace '\.fullName' '.fullname' 'TeacherApplication'

echo "✅ Replacements completed!"
echo "🔍 Running build..."
npm run build
