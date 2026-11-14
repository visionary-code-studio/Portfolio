'use client';

import React, { useState } from 'react';
import RazorpayButton from '@/components/ui/RazorpayButton';
import styles from './CheckoutTest.module.css';

export default function CheckoutTestPage() {
  const [customAmount, setCustomAmount] = useState<number>(100); // 100 paise = ₹1.00
  const [name, setName] = useState<string>('Test Customer');
  const [email, setEmail] = useState<string>('test.customer@example.com');
  const [contact, setContact] = useState<string>('9999999999');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>Razorpay Standard Checkout</span>
          <h1 className={styles.title}>Payment Checkout Test</h1>
          <p className={styles.subtitle}>
            Test your Razorpay Web Standard Checkout flow with backend order creation &amp; HMAC-SHA256 signature verification.
          </p>
        </div>

        <div className={styles.formSection}>
          <div className={styles.field}>
            <label className={styles.label}>Amount (in INR ₹)</label>
            <div className={styles.inputWrap}>
              <span className={styles.currencyPrefix}>₹</span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={(customAmount / 100).toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCustomAmount(isNaN(val) ? 100 : Math.max(100, Math.round(val * 100)));
                }}
                className={styles.input}
              />
            </div>
            <span className={styles.hint}>
              Amount in paise: <strong>{customAmount} paise</strong> (Minimum: 100 paise)
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Customer Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.buttonWrap}>
            <RazorpayButton
              amount={customAmount}
              currency="INR"
              name="Vaibhav Shaw Portfolio"
              description={`Payment Test for ₹${(customAmount / 100).toFixed(2)}`}
              buttonText={`Pay ₹${(customAmount / 100).toFixed(2)} with Razorpay`}
              prefill={{
                name,
                email,
                contact,
              }}
              notes={{
                purpose: 'Standard Checkout Demo',
                customer_name: name,
              }}
              onSuccess={(res) => {
                setPaymentResult(res);
              }}
            />
          </div>

          {paymentResult && (
            <div className={styles.resultBox}>
              <h3 className={styles.resultTitle}>✓ Payment Verified Successfully!</h3>
              <div className={styles.resultItem}>
                <span>Payment ID:</span> <code>{paymentResult.razorpay_payment_id}</code>
              </div>
              <div className={styles.resultItem}>
                <span>Order ID:</span> <code>{paymentResult.razorpay_order_id}</code>
              </div>
              <div className={styles.resultItem}>
                <span>Signature:</span> <code>{paymentResult.razorpay_signature?.slice(0, 24)}...</code>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footerNote}>
          <p>
            🔒 Protected by Razorpay Standard Web Checkout. Key secret is securely stored on server and never exposed to the client.
          </p>
        </div>
      </div>
    </main>
  );
}
