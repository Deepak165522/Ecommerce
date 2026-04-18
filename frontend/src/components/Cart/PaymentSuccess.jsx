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
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      const res = await axios.post(
        "http://localhost:4000/api/v1/order/new",
        {
          shippingInfo,
          orderItems: cartItems,
          totalPrice: cartItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          ),
          paymentInfo: {
            id: sessionId,
            status: "succeeded",
          },
        },
        {
          withCredentials: true, // 🔥 MUST
        }
      );

      navigate("/orders/success");
    } catch (error) {
      console.log("❌ ERROR:", error.response?.data || error.message);
      navigate("/orders/failed");
    }
  };

  createOrder();
}, []);

if (!shippingInfo || !cartItems?.length) {
  navigate("/cart");
}


console.log("🔥 PaymentSuccess loaded");

console.log("🔥 API CALL START");
    return <h2 className="text-center mt-20">Processing Order...</h2>;
};

export default PaymentSuccess;