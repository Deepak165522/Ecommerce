// const express = require('express');
// const { processPayment, paytmResponse, getPaymentStatus } = require('../controllers/paymentController');
// const { isAuthenticatedUser } = require('../middlewares/auth');

// const router = express.Router();

// router.route('/payment/process').post(processPayment);
// // router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey);

// router.route('/callback').post(paytmResponse);

// router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

// module.exports = router;


const express = require('express');

const { 
  processPayment, 
  verifyPayment,
  processStripePayment,
  stripeCheckoutSession   // ✅ ADD THIS
} = require('../controllers/paymentController');

const router = express.Router();

// ✅ Razorpay
router.post('/payment/process', processPayment);
router.post('/payment/verify', verifyPayment);

// ✅ Stripe
router.post('/payment/stripe', processStripePayment);
router.post('/payment/stripe/checkout', stripeCheckoutSession);

module.exports = router;