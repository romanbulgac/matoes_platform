// Stripe.js initialization and utilities
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance (singleton pattern)
 * Loads Stripe.js only once and caches the promise
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, currency: string = 'RON'): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get user-friendly error message from Stripe error code
 */
export const getStripeErrorMessage = (errorCode?: string): string => {
  const errorMessages: Record<string, string> = {
    'card_declined': 'Cardul dvs. a fost refuzat. Vă rugăm să încercați cu alt card.',
    'insufficient_funds': 'Fonduri insuficiente pe card.',
    'expired_card': 'Cardul a expirat. Vă rugăm să folosiți un alt card.',
    'incorrect_cvc': 'Codul CVC este incorect.',
    'incorrect_number': 'Numărul cardului este incorect.',
    'invalid_expiry_month': 'Luna de expirare este invalidă.',
    'invalid_expiry_year': 'Anul de expirare este invalid.',
    'processing_error': 'A apărut o eroare la procesarea plății. Vă rugăm să încercați din nou.',
    'rate_limit': 'Prea multe încercări. Vă rugăm să așteptați câteva minute.',
    'payment_intent_authentication_failure': 'Autentificarea plății a eșuat. Vă rugăm să contactați banca.',
  };

  return errorMessages[errorCode || ''] || 'A apărut o eroare la procesarea plății. Vă rugăm să încercați din nou sau să contactați banca.';
};

/**
 * Validate card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};
