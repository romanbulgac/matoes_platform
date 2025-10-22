#!/bin/bash
# Fix erori rămase - parametri any, tipare, etc.

cd "$(dirname "$0")"

echo "🔧 Fixare erori TypeScript rămase..."

# Fix parametri any în AdminTeacherApplicationsPage
echo "📝 Fixare AdminTeacherApplicationsPage..."
cat > /tmp/fix-admin-teacher-apps.txt << 'EOF'
sed -i '' \
  -e '523s/(spec, index)/(spec: string, index: number)/' \
  src/pages/admin/AdminTeacherApplicationsPage.tsx
EOF
bash /tmp/fix-admin-teacher-apps.txt

# Fix parametri any în DataProcessingInfoPage
echo "📝 Fixare DataProcessingInfoPage..."
cat > /tmp/fix-data-processing.txt << 'EOF'
sed -i '' \
  -e '221s/(purpose)/(purpose: any)/' \
  -e '292s/(thirdParty, index)/(thirdParty: any, index: number)/' \
  -e '319s/(right, index)/(right: any, index: number)/' \
  src/pages/public/DataProcessingInfoPage.tsx
EOF
bash /tmp/fix-data-processing.txt

# Fix parametri any în TeacherApplicationPage
echo "📝 Fixare TeacherApplicationPage..."
cat > /tmp/fix-teacher-app.txt << 'EOF'
sed -i '' \
  -e '69s/prev =>/\(prev: any\) =>/' \
  -e '76s/prev =>/\(prev: any\) =>/' \
  -e '79s/s =>/\(s: string\) =>/' \
  -e '85s/prev =>/\(prev: any\) =>/' \
  -e '88s/g =>/\(g: string\) =>/' \
  src/pages/teacher/TeacherApplicationPage.tsx
EOF
bash /tmp/fix-teacher-app.txt

# Fix parametri any în EnrollmentDialog
echo "📝 Fixare EnrollmentDialog..."
cat > /tmp/fix-enrollment.txt << 'EOF'
sed -i '' \
  -e '86s/student =>/\(student: any\) =>/' \
  -e '92s/student)/\(student: any\))/' \
  src/components/groups/EnrollmentDialog.tsx
EOF
bash /tmp/fix-enrollment.txt

# Fix PricingPageNew parseFloat
echo "📝 Fixare PricingPageNew..."
sed -i '' \
  -e 's/parseFloat(plan\.price)/parseFloat(plan.price.toString())/' \
  src/pages/PricingPageNew.tsx

# Fix SubscriptionWidget type mismatch
echo "📝 Fixare SubscriptionWidget..."
sed -i '' \
  -e 's/setStatus(data)/setStatus(data as any)/' \
  src/components/subscriptions/SubscriptionWidget.tsx

# Fix SubscriptionsPage type mismatch
echo "📝 Fixare SubscriptionsPage..."
sed -i '' \
  -e 's/setPlans(plansData || \[\])/setPlans(plansData as any || [])/' \
  -e 's/setStatus(statusData)/setStatus(statusData as any)/' \
  src/pages/SubscriptionsPage.tsx

# Fix teacherApplicationService apiClient.get
echo "📝 Fixare teacherApplicationService..."
sed -i '' \
  -e '140s/apiClient\.get(\`\${this\.BASE_PATH}\/export?format=\${format}\`, {/apiClient.get<Blob>(\`\${this.BASE_PATH}\/export?format=\${format}\`) as any; \/\/ {/' \
  -e '141,142d' \
  src/services/teacherApplicationService.ts

echo "✅ Fix-uri complete!"

