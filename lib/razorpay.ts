import Razorpay from 'razorpay';

const key_id =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  'rzp_test_U0B6DL8ARP7MF8';

const key_secret =
  process.env.RAZORPAY_KEY_SECRET ||
  'bF2DBtbVYIcFSnlPEtKV7Dws';

export const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

export { key_id, key_secret };
