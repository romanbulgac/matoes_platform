#!/bin/bash

# Скрипт для исправления PascalCase → camelCase в компонентах (без UI компонентов)

echo "🔧 Fixing PascalCase → camelCase in business components..."

# Exclude src/components/ui/ directory
EXCLUDE_PATTERN='src/components/ui'

# Функция для замены в файлах (исключая UI компоненты)
replace_in_files() {
  local pattern=$1
  local replacement=$2
  
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/ui/*" \
    -exec grep -l "$pattern" {} \; | while read file; do
    sed -i '' "s/$pattern/$replacement/g" "$file"
    echo "  ✓ Fixed: $file"
  done
}

# UserDto fields - только в объектах/переменных (с точкой перед)
echo "📝 Fixing UserDto property access..."
replace_in_files '\.Id\>' '.id'
replace_in_files '\.Email\>' '.email'  
replace_in_files '\.Name\>' '.name'
replace_in_files '\.Surname\>' '.surname'
replace_in_files '\.PhoneNumber\>' '.phoneNumber'
replace_in_files '\.ProfilePicture\>' '.profilePicture'

# SubscriptionPlanDto fields
echo "📝 Fixing SubscriptionPlanDto property access..."
replace_in_files '\.Price\>' '.price'
replace_in_files '\.Currency\>' '.currency'
replace_in_files '\.Interval\>' '.interval'
replace_in_files '\.TrialPeriodDays\>' '.trialPeriodDays'
replace_in_files '\.MaxConsultationsPerMonth\>' '.maxConsultationsPerMonth'
replace_in_files '\.UnlimitedConsultations\>' '.unlimitedConsultations'
replace_in_files '\.Features\>' '.features'

# SubscriptionStatusDto fields
echo "📝 Fixing SubscriptionStatusDto property access..."
replace_in_files '\.UserId\>' '.userId'
replace_in_files '\.HasActiveSubscription\>' '.hasActiveSubscription'
replace_in_files '\.SubscriptionId\>' '.subscriptionId'
replace_in_files '\.PlanName\>' '.planName'
replace_in_files '\.Status\>' '.status'
replace_in_files '\.CurrentPeriodEnd\>' '.currentPeriodEnd'
replace_in_files '\.IsInTrial\>' '.isInTrial'
replace_in_files '\.TrialEnd\>' '.trialEnd'
replace_in_files '\.CancelAtPeriodEnd\>' '.cancelAtPeriodEnd'

# ConsentTypeInfo и другие DTO
echo "📝 Fixing ConsentTypeInfo and other DTOs..."
replace_in_files '\.displayName\>' '.displayname'
replace_in_files '\.teacherName\>' '.teachername'
replace_in_files '\.studentName\>' '.studentname'
replace_in_files '\.childName\>' '.childname'
replace_in_files '\.childEmail\>' '.childemail'
replace_in_files '\.firstName\>' '.firstname'
replace_in_files '\.lastName\>' '.lastname'

echo "✅ All replacements completed!"
echo "🔍 Running build to check for remaining errors..."
npm run build
