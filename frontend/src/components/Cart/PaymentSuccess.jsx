import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    

    const navigate = useNavigate();
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

   useEffect(() => {

    const createOrder = async () => {
        try {

            console.log("USER:", user);
            console.log("TOKEN:", user?.token);
            console.log("shippingInfo:", shippingInfo);
            console.log("cartItems:", cartItems);

           const token = localStorage.getItem("token");
           const params = new URLSearchParams(window.location.search);
const sessionId = params.get("session_id"); // 🔥 Stripe se aayega


const res = await axios.post("/api/v1/order/new", {
    shippingInfo,
    orderItems: cartItems,
    totalPrice: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    paymentInfo: {
        id: sessionId,
        status: "succeeded"
    }
}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

            console.log("ORDER SUCCESS:", res.data);

            navigate("/orders/success");

        } catch (error) {
            console.log("❌ FULL ERROR:", error.response?.data || error.message);
            navigate("/orders/failed");
        }
    };

    createOrder();

}, []);

    return <h2 className="text-center mt-20">Processing Order...</h2>;
};

export default PaymentSuccess;