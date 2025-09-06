// lib/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Utility function to format currency
export const formatPrice = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

// Utility function to convert price to cents
export const convertToStripeAmount = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility function to convert from Stripe amount (cents) to euros
export const convertFromStripeAmount = (amount: number): number => {
  return amount / 100;
};

// Type definitions for better TypeScript support
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  deliveryInstructions?: string;
  newsletter: boolean;
}

export interface CheckoutSessionData {
  items: CartItem[];
  customerInfo: CustomerInfo;
  cartTotal: number;
}