'use client';

import React, { useState } from 'react';
import styles from './RazorpayButton.module.css';

interface RazorpayButtonProps {
  amount?: number; // In paise (default: 100 paise = ₹1.00)
  currency?: string;
  name?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
  onSwitchToQr?: () => void;
  paymentPageUrl?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({
  amount = 100, // 100 paise = ₹1.00
  currency = 'INR',
  name = 'Vaibhav Shaw · Official Portfolio',
  description = 'Authorized Collaboration & Services Deposit',
  buttonText = 'Pay with Razorpay Gateway',
  className = '',
  prefill = {},
  notes = {},
  onSuccess,
  onFailure,
  onSwitchToQr,
  paymentPageUrl = 'https://rzp.io/rzp/visionary-code-studio',
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showQrSuggestion, setShowQrSuggestion] = useState(false);

  // Helper to load Razorpay Checkout script dynamically if not present
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowQrSuggestion(false);

    try {
      // 1. Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setShowQrSuggestion(true);
        throw new Error('Could not connect to Razorpay. You can use Direct UPI QR Code payment below.');
      }

      // 2. Call backend endpoint to create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `rcpt_${Date.now()}`,
          notes,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        if (orderData.fallbackToQr) {
          setShowQrSuggestion(true);
        }
        throw new Error(orderData.error || 'Payment gateway could not generate order. Please use Direct UPI QR Code.');
      }

      // 3. Open Razorpay modal with order_id
      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_live_U2YDuoQaXVUCbb';

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name,
        description,
        order_id: orderData.order_id,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        notes: {
          ...notes,
          order_id: orderData.order_id,
        },
        theme: {
          color: '#07090e',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Payment modal dismissed by user');
          },
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 4. Send payment details to verification endpoint
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setSuccessMessage(`Payment confirmed! Reference ID: ${response.razorpay_payment_id}`);
              if (onSuccess) onSuccess(response);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            setErrorMessage(verifyErr.message || 'Payment signature verification failed.');
            if (onFailure) onFailure(verifyErr);
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        setShowQrSuggestion(true);
        setErrorMessage(
          response?.error?.description ||
          response?.error?.reason ||
          'Payment could not be completed via card/gateway. Please use Direct UPI QR Code option.'
        );
        setLoading(false);
        if (onFailure) onFailure(response.error);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setErrorMessage(err.message || 'Gateway currently unavailable. Please use Direct UPI QR Code.');
      setLoading(false);
      if (onFailure) onFailure(err);
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={`${styles.payButton} ${className}`}
        data-cursor-hover
      >
        {loading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} />
            Initializing Secure Gateway...
          </span>
        ) : (
          <span className={styles.btnContent}>
            <span className={styles.btnLeftWrap}>
              <svg
                className={styles.razorpayIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
              >
                <path
                  d="M14.5 3L6 14H11.5L9.5 21L18 10H12.5L14.5 3Z"
                  fill="currentColor"
                />
              </svg>
              <span>{buttonText}</span>
            </span>
            <span className={styles.btnArrow}>→</span>
          </span>
        )}
      </button>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert">
          <div className={styles.errorAlertContent}>
            <span>⚠️ {errorMessage}</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {paymentPageUrl && (
                <a
                  href={paymentPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.qrSwitchBtn}
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  💳 Open Official Razorpay Page ➔
                </a>
              )}
              {showQrSuggestion && onSwitchToQr && (
                <button
                  type="button"
                  className={styles.qrSwitchBtn}
                  onClick={onSwitchToQr}
                >
                  📱 Pay via Direct UPI QR Code (Key-Secured) ➔
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            className={styles.closeAlert}
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className={styles.successAlert} role="status">
          <span>✓ {successMessage}</span>
          <button
            type="button"
            className={styles.closeAlert}
            onClick={() => setSuccessMessage(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
