#!/bin/bash
# Финальная массовая замена ВСЕХ полей одной командой

echo "🔧 Начинаю финальную замену всех PascalCase → camelCase..."

find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/ui/*" ! -name "*.test.*" ! -name "*.spec.*" -print0 | xargs -0 sed -i '' \
  -e 's/\.HasActiveSubscription/.hasActiveSubscription/g' \
  -e 's/\.IsInTrial/.isInTrial/g' \
  -e 's/\.CancelAtPeriodEnd/.cancelAtPeriodEnd/g' \
  -e 's/\.MaxConsultationsPerMonth/.maxConsultationsPerMonth/g' \
  -e 's/\.UnlimitedConsultations/.unlimitedConsultations/g' \
  -e 's/\.PlanName/.planName/g' \
  -e 's/\.TrialEnd/.trialEnd/g' \
  -e 's/\.CurrentPeriodEnd/.currentPeriodEnd/g' \
  -e 's/\.SubscriptionId/.subscriptionId/g' \
  -e 's/\.UserId/.userId/g' \
  -e 's/\.ProfilePicture/.profilePicture/g' \
  -e 's/\.PhoneNumber/.phoneNumber/g' \
  -e 's/\.Description/.description/g' \
  -e 's/\.TrialPeriodDays/.trialPeriodDays/g' \
  -e 's/firstName/firstname/g' \
  -e 's/lastName/lastname/g' \
  -e 's/\.Id\([^a-zA-Z]\)/\.id\1/g' \
  -e 's/\.Name\([^a-zA-Z]\)/\.name\1/g' \
  -e 's/\.Surname\([^a-zA-Z]\)/\.surname\1/g' \
  -e 's/\.Email\([^a-zA-Z]\)/\.email\1/g' \
  -e 's/\.Price\([^a-zA-Z]\)/\.price\1/g' \
  -e 's/\.Currency\([^a-zA-Z]\)/\.currency\1/g' \
  -e 's/\.Interval\([^a-zA-Z]\)/\.interval\1/g' \
  -e 's/\.Features\([^a-zA-Z]\)/\.features\1/g' \
  -e 's/\.Status\([^a-zA-Z]\)/\.status\1/g' \
  -e 's/studentname/studentName/g' \
  -e 's/teachername/teacherName/g' \
  -e 's/childname/childName/g' \
  -e 's/childsurname/childSurname/g' \
  -e 's/parentname/parentName/g' \
  -e 's/parentemail/parentEmail/g' \
  -e 's/planname/planName/g' \
  -e 's/devicename/deviceName/g' \
  -e 's/fullname/fullName/g' \
  -e 's/displayname/displayName/g' \
  -e 's/classname:/className:/g' \
  -e "s/'PhoneNumber'/'phoneNumber'/g" \
  -e "s/'Status'/'status'/g" \
  -e "s/'Id'/'id'/g" \
  -e "s/'Name'/'name'/g" \
  -e "s/'Surname'/'surname'/g" \
  -e "s/'Email'/'email'/g" \
  -e "s/'Price'/'price'/g"

echo "✅ Все замены выполнены!"
echo "🔍 Запускаю build для проверки..."
npm run build
