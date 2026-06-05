'use client';

import { useEffect, useState } from 'react';

// --- UPDATED TYPES ---
// We updated the type to support BOTH One-Time and Recurring (Subscription) payments.

export type RazorpayOptions = {
  key: string;

  // Make these OPTIONAL because Subscriptions don't use them
  amount?: number;
  order_id?: string;

  // Add this for Recurring Payments
  subscription_id?: string;

  currency: string;
  name: string;
  description: string;

  handler: (response: {
    razorpay_payment_id: string;
    razorpay_signature: string;

    // Make this optional (it won't exist for subscriptions)
    razorpay_order_id?: string;

    // Add this (it will exist ONLY for subscriptions)
    razorpay_subscription_id?: string;
  }) => void;

  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  notes?: Record<string, string>;
};

// The instance that the constructor returns
export interface RazorpayInstance {
  open: () => void;
}

// This tells TypeScript what the Razorpay object on the window looks like
declare global {
  interface Window {
    // It's a constructor that takes options and returns an instance
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
// --- END OF FIX ---


export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if we are on the client (browser)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already in DOM to prevent duplicates
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      // If it exists but isn't loaded yet, we could add listeners, 
      // but usually relying on the window check above is safer for React re-renders.
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setIsLoaded(false);
    };

    document.body.appendChild(script);

    // Cleanup usually isn't required for global scripts like this,
    // but if you really want to remove it on unmount:
    return () => {
      // Optional: Remove script on unmount if needed
      // document.body.removeChild(script);
    };
  }, []);

  return isLoaded;
};