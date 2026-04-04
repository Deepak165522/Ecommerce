import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
// import {
//     CardNumberElement,
//     CardCvcElement,
//     CardExpiryElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Payment = () => {

    const stripe = useStripe();
const elements = useElements();

    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const stripe = useStripe();
    // const elements = useElements();
    // const paymentBtn = useRef(null);

    const [payDisable, setPayDisable] = useState(false);
const [method, setMethod] = useState("razorpay");
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
    };

   

   




const submitHandler = async () => {
    setPayDisable(true);

    try {
        const { data } = await axios.post(
  `${process.env.REACT_APP_API_URL}/payment/process`,
  paymentData
);

        const options = {
            key: "rzp_test_SZH0o4v3M69x3P",
            amount: data.order.amount,
            currency: "INR",
            name: "EliteKart",
            description: "Order Payment",
            order_id: data.order.id,

            prefill: {
                name: user?.name,
                email: user?.email,
                contact: shippingInfo?.phoneNo,
            },

            theme: {
                color: "#2874f0",
            },

            modal: {
                ondismiss: () => setPayDisable(false)
            },

            handler: async function (response) {
                await axios.post(
  `${process.env.REACT_APP_API_URL}/payment/verify`,
  {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
  }
);

               await axios.post(
  `${process.env.REACT_APP_API_URL}/order/new`,
  {
    shippingInfo,
    orderItems: cartItems,
    totalPrice,
    paymentInfo: {
      id: response.razorpay_payment_id,
      status: "succeeded"
    }
  },
  {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    }
  }
);

                window.location.href = `/order/${response.razorpay_order_id}`;
            },
        };

        if (!window.Razorpay) {
            alert("SDK load nahi hua ❌");
            return;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        setPayDisable(false);
        enqueueSnackbar("Payment Failed", { variant: "error" });
    }
};

const stripeHandler = async () => {
    setPayDisable(true);

    try {
        // 🔥 DEBUG (important)
        console.log("TOTAL PRICE:", totalPrice);

        // ❌ empty cart check
        if (!totalPrice || totalPrice <= 0) {
            enqueueSnackbar("Cart empty hai ❌", { variant: "error" });
            setPayDisable(false);
            return;
        }

        const paymentPayload = {
            amount: Number(totalPrice), // 🔥 ensure number
        };

        console.log("SENDING DATA:", paymentPayload);

        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/payment/stripe/checkout`,
            paymentPayload
        );

        console.log("STRIPE RESPONSE:", data);

        // 🔥 redirect to stripe
        window.location.href = data.url;

    } catch (error) {
        console.log("❌ STRIPE ERROR:", error.response?.data || error.message);
        setPayDisable(false);
        enqueueSnackbar(
            error.response?.data?.message || "Stripe Payment Failed",
            { variant: "error" }
        );
    }
};
    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);


    return (
        <>
            <MetaData title="Flipkart: Secure Payment | Paytm" />

            <main className="w-full mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">

                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="paytm"
                                            name="payment-radio-button"
                                        >
                                            <FormControlLabel
                                                value="paytm"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
                                                        <span>Paytm</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />

                                </form> */}

                                <div className="flex flex-col justify-start gap-2 w-full mx-8 my-4">

   <FormControl>
      <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
         <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label="Razorpay"
         />

         <FormControlLabel
   value="stripe"
   control={<Radio />}
   label="Stripe"
/>
      </RadioGroup>
   </FormControl>

   {/* {method === "stripe" && (
    <div className="my-4 p-2 border">
        <CardElement />
    </div>
)} */}

   <button
      onClick={() => {
    if (method === "razorpay") {
        submitHandler();
    } else {
        stripeHandler();
    }
}}
      disabled={payDisable}
      className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white`}
   >
      Pay ₹{totalPrice.toLocaleString()}
   </button>

</div>

                                {/* stripe form */}
                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
                                <div>
                                    <CardNumberElement />
                                </div>
                                <div>
                                    <CardExpiryElement />
                                </div>
                                <div>
                                    <CardCvcElement />
                                </div>
                                <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
                            </form> */}
                                {/* stripe form */}

                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;