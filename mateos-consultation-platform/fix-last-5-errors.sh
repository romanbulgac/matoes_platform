#!/bin/bash

# Final fix for last 5 errors
echo "Final fix for last 5 errors..."

# Fix TeacherApplicationPage.tsx form field names
sed -i '' 's/name="firstname"/name="firstName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="lastname"/name="lastName"/g' src/pages/teacher/TeacherApplicationPage.tsx
sed -i '' 's/name="phone"/name="phoneNumber"/g' src/pages/teacher/TeacherApplicationPage.tsx

echo "Final fix completed"
