#!/bin/bash

# Script to fix all PascalCase fields to camelCase after ApiClient auto-transform implementation
# This updates all components to use camelCase fields returned by the API

echo "🔧 Fixing PascalCase → camelCase in all components..."

# UserDto fields
echo "📝 Fixing UserDto fields..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Id\>/\.id/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Email\>/\.email/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Name\>/\.name/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Surname\>/\.surname/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.PhoneNumber\>/\.phoneNumber/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.ProfilePicture\>/\.profilePicture/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Role\>/\.role/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.LastLogin\>/\.lastLogin/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.CreatedAt\>/\.createdAt/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.UpdatedAt\>/\.updatedAt/g' {} +

# SubscriptionPlanDto fields  
echo "📝 Fixing SubscriptionPlanDto fields..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Description\>/\.description/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Price\>/\.price/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Currency\>/\.currency/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Interval\>/\.interval/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.TrialPeriodDays\>/\.trialPeriodDays/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.MaxConsultationsPerMonth\>/\.maxConsultationsPerMonth/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.UnlimitedConsultations\>/\.unlimitedConsultations/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Features\>/\.features/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.ExternalPriceId\>/\.externalPriceId/g' {} +

# SubscriptionStatusDto fields
echo "📝 Fixing SubscriptionStatusDto fields..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.UserId\>/\.userId/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.HasActiveSubscription\>/\.hasActiveSubscription/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.SubscriptionId\>/\.subscriptionId/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.PlanName\>/\.planName/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.Status\>/\.status/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.CurrentPeriodEnd\>/\.currentPeriodEnd/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.IsInTrial\>/\.isInTrial/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.TrialEnd\>/\.trialEnd/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/\.CancelAtPeriodEnd\>/\.cancelAtPeriodEnd/g' {} +

# Object literal properties (for POST data)
echo "📝 Fixing object literal properties..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Name:/name:/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Surname:/surname:/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Email:/email:/g' {} +

echo "✅ All fixes applied! Running build to verify..."
npm run build
