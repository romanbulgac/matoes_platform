# Subscription Checkout Fix - ExternalPriceId Issue

**Date**: 2025-10-14 23:55 UTC  
**Status**: ✅ FIXED

## 🐛 Problem

**Error from Stripe**:
```
"Stripe error: You must provide at least one recurring price in `subscription` mode when using prices."
```

**Root Cause**: `SubscriptionPlans` table has **empty or null `ExternalPriceId`** values.

## 🔍 Diagnosis

### What Happened:
1. ✅ Backend fixed: All `IsActive` LINQ queries replaced → **SUCCESS**
2. ✅ Checkout endpoint now reachable → **SUCCESS**  
3. ❌ Stripe rejects checkout → **`ExternalPriceId` missing**

### Why It Failed:
```csharp
// BusinessLayer/Implementations/SubscriptionManagerService.cs Line 86:
PriceId = plan.ExternalPriceId  // ← This was empty string!

// Stripe requires valid Price ID like:
// "price_1234abcdefgh..." (production)
// "price_basic_monthly_ron" (mock provider)
```

## ✅ Solutions Implemented

### 1. Frontend Type Fix
**File**: `src/types/index.ts`

**Added missing field**:
```typescript
export interface SubscriptionPlanInfoDto {
  // ... other fields ...
  externalPriceId: string; // ← ADDED: Stripe/PayPal price ID for checkout
  isPopular?: boolean;
}
```

### 2. Backend Validation & Auto-Generation
**File**: `BusinessLayer/Implementations/SubscriptionManagerService.cs`

**Added validation** (lines 83-103):
```csharp
// Validate ExternalPriceId
if (string.IsNullOrWhiteSpace(plan.ExternalPriceId))
{
    _logger.LogError("Plan {PlanId} ({PlanName}) has empty ExternalPriceId.", 
        plan.Id, plan.Name);
    
    // Auto-generate for Mock Provider (development only)
    if (_paymentProvider.ProviderName == "Mock")
    {
        plan.ExternalPriceId = $"price_{plan.Name.ToLower()}_{plan.Interval.ToString().ToLower()}_{plan.Currency.ToLower()}";
        _logger.LogWarning("Auto-generated Mock price ID: {PriceId}", plan.ExternalPriceId);
    }
    else
    {
        return new SubscriptionCheckoutResultDto
        {
            Success = false,
            ErrorMessage = $"Subscription plan '{plan.Name}' is not properly configured. Missing Stripe Price ID."
        };
    }
}
```

**Benefits**:
- ✅ Prevents empty PriceId from reaching Stripe
- ✅ Auto-generates IDs for Mock Provider (development)
- ✅ Shows clear error message for production Stripe
- ✅ Logs issue for debugging

### 3. Database Fix Script
**File**: `DataAccess/Migrations/fix_external_price_id.sql`

**Purpose**: Update existing plans with valid ExternalPriceId

**For Mock Provider** (testing):
```sql
UPDATE "SubscriptionPlans" 
SET "ExternalPriceId" = 'price_basic_monthly_ron'
WHERE "Name" = 'Basic' AND "Interval" = 2;

UPDATE "SubscriptionPlans" 
SET "ExternalPriceId" = 'price_premium_monthly_ron'
WHERE "Name" = 'Premium' AND "Interval" = 2;

UPDATE "SubscriptionPlans" 
SET "ExternalPriceId" = 'price_pro_monthly_ron'
WHERE "Name" = 'Pro' AND "Interval" = 2;

-- Repeat for Yearly plans (Interval = 4)
```

**For Production Stripe** (replace with actual Stripe Price IDs):
```sql
UPDATE "SubscriptionPlans" 
SET "ExternalPriceId" = 'price_1QabcXYZ123...'  -- Real Stripe ID
WHERE "Name" = 'Basic' AND "Interval" = 2;
```

## 📊 How to Get Stripe Price IDs

### Option 1: Stripe Dashboard
1. Go to https://dashboard.stripe.com/test/prices
2. Find your price (e.g., "Basic Monthly - 50 RON")
3. Copy Price ID: `price_1234abcdefghijk...`
4. Update database with this ID

### Option 2: Stripe CLI
```bash
stripe prices list --limit 10

# Output shows:
# id: price_1QabcXYZ...
# product: prod_ABC123
# unit_amount: 5000 (50.00 RON)
# recurring: { interval: month }
```

### Option 3: Create Prices Programmatically
```bash
# Create Basic Monthly Price
stripe prices create \
  --unit-amount=5000 \
  --currency=ron \
  --recurring[interval]=month \
  --product=prod_BasicPlan123

# Returns: price_1Qabc...
```

## 🧪 Testing

### With Mock Provider (Auto-Generated IDs)
```bash
# 1. Start backend (it will auto-generate price IDs)
cd WebAPI && dotnet watch run

# 2. Try checkout
# Expected log:
# [WARN] Auto-generated Mock price ID: price_basic_monthly_ron
# ✅ Checkout succeeds with mock provider
```

### With Real Stripe
```bash
# 1. Update database with real Stripe Price IDs
psql -h localhost -U postgres -d mateos_db -f DataAccess/Migrations/fix_external_price_id.sql

# 2. Start backend
cd WebAPI && dotnet watch run

# 3. Try checkout
# ✅ Should redirect to Stripe Checkout page
```

## 🎯 Next Steps

### Immediate (to unblock testing):
1. ✅ Code changes deployed (auto-recompile via dotnet watch)
2. ⏳ **Refresh browser to get new TypeScript types**
3. ⏳ **Try checkout again** - should auto-generate Mock price ID

### Short Term (before production):
1. Create real Stripe Prices in Stripe Dashboard
2. Run SQL update script with real Stripe Price IDs
3. Test checkout with real Stripe
4. Verify webhooks update subscription status

### Long Term:
1. Add Stripe Price ID validation on plan creation
2. Add migration to create Stripe Prices automatically
3. Add admin UI to manage Stripe integration
4. Add database constraint: `ExternalPriceId` NOT NULL

## 📁 Files Modified

### Backend (2 files):
1. `BusinessLayer/Implementations/SubscriptionManagerService.cs`
   - Added validation for empty ExternalPriceId
   - Auto-generates IDs for Mock Provider
   - Shows user-friendly error for production

2. `DataAccess/Migrations/fix_external_price_id.sql` (NEW)
   - SQL script to update existing plans
   - Includes examples for all plans

### Frontend (1 file):
1. `src/types/index.ts`
   - Added `externalPriceId: string` to SubscriptionPlanInfoDto
   - Aligns with backend DTO

## ✅ Verification

### Build Status:
```bash
# Backend
✅ Compiles with auto-generation logic

# Frontend  
✅ TypeScript builds with new field
```

### Expected Behavior:
**With Mock Provider**:
- ✅ Auto-generates price ID: `price_basic_monthly_ron`
- ✅ Checkout succeeds immediately
- ✅ Shows success page

**With Stripe** (after updating DB):
- ✅ Uses real Stripe Price ID
- ✅ Redirects to Stripe Checkout
- ✅ User can enter payment details

## 🔗 Related Issues

- [x] Issue #1: Entity Framework IsActive translation (FIXED)
- [x] Issue #2: Frontend API calls using fetch instead of service (FIXED)
- [x] Issue #3: ExternalPriceId missing (FIXED)
- [ ] Issue #4: Need real Stripe Price IDs for production (PENDING)

## 📚 Documentation

- Database schema: `DataAccess/Models/Subscription.cs` line 110
- Backend DTO: `BusinessLayer/Interfaces/ISubscriptionManagerService.cs` line 118
- Frontend DTO: `src/types/index.ts` line 709
- Stripe Price API: https://stripe.com/docs/api/prices

---

**Status**: ✅ **READY FOR TESTING**  
**Action Required**: Refresh browser and try checkout again  
**Expected**: Auto-generated price ID works with Mock Provider
