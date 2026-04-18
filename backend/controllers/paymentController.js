



const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require('../models/paymentModel');
const ErrorHandler = require('../utils/errorHandler');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 🔑 Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ================== RAZORPAY CREATE ORDER ==================
exports.processPayment = asyncErrorHandler(async (req, res, next) => {

    const { amount } = req.body;

    if (!amount) {
        return next(new ErrorHandler("Amount is required", 400));
    }

    const options = {
        amount: Number(amount * 100), // paise
        currency: "INR",
        receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
});


// ================== RAZORPAY VERIFY PAYMENT ==================
exports.verifyPayment = asyncErrorHandler(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // ✅ FIXED
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return next(new ErrorHandler("Payment Verification Failed", 400));
    }

    // ✅ Save payment
    await Payment.create({
        orderId: razorpay_order_id,
        txnId: razorpay_payment_id,
        resultInfo: {
            resultStatus: "TXN_SUCCESS",
            resultCode: "200",
            resultMsg: "Payment Successful"
        }
    });

    res.status(200).json({
        success: true,
    });
});


// ================== STRIPE PAYMENT ==================
exports.processStripePayment = asyncErrorHandler(async (req, res, next) => {

    const { amount } = req.body;

    if (!amount) {
        return next(new ErrorHandler("Amount is required", 400));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount * 100),
            currency: "inr",
            metadata: {
                integration_check: "accept_a_payment",
            },
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.stripeCheckoutSession = asyncErrorHandler(async (req, res, next) => {

    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "EliteKart Order",
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",

        // 🔥 VERY IMPORTANT
       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.FRONTEND_URL}/orders/failed`,
    });

    res.status(200).json({
        success: true,
        url: session.url,
    });
});