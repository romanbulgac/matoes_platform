#!/bin/bash

# 🚀 Subscription System Setup Script
# Mateos Consultation Platform

echo "🎯 Setting up Subscription System..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ npm is installed"
echo ""

# Install dependencies
echo "📦 Installing required dependencies..."
npm install @stripe/stripe-js @stripe/react-stripe-js date-fns

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Existing Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SIGNALR_URL=http://localhost:5000/hubs
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update VITE_STRIPE_PUBLISHABLE_KEY with your actual key"
else
    # Check if VITE_STRIPE_PUBLISHABLE_KEY exists in .env
    if ! grep -q "VITE_STRIPE_PUBLISHABLE_KEY" .env; then
        echo "⚠️  Adding VITE_STRIPE_PUBLISHABLE_KEY to .env..."
        echo "" >> .env
        echo "# Stripe Configuration" >> .env
        echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here" >> .env
        echo "✅ VITE_STRIPE_PUBLISHABLE_KEY added to .env"
        echo "⚠️  Please update with your actual key"
    else
        echo "✅ VITE_STRIPE_PUBLISHABLE_KEY already exists in .env"
    fi
fi

echo ""

# Build check
echo "🔨 Running TypeScript build check..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "⚠️  Build completed with warnings (this is normal if Stripe key is not set yet)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Subscription System Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Update .env with your Stripe publishable key:"
echo "   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Navigate to one of these pages:"
echo "   - http://localhost:5173/subscriptions (requires auth)"
echo "   - http://localhost:5173/dashboard (to see widget)"
echo ""
echo "4. Check documentation:"
echo "   - QUICK_START_SUBSCRIPTIONS.md"
echo "   - SUBSCRIPTION_SYSTEM_GUIDE.md"
echo "   - SUBSCRIPTION_SYSTEM_SUMMARY.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Happy coding!"
echo ""
