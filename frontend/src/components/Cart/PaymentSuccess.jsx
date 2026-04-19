import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {

  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {

    // 🔥 FIRST CHECK INSIDE useEffect
    if (!shippingInfo || !cartItems?.length) {
      navigate("/cart");
      return;
    }

    const createOrder = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        await axios.post(
          `${process.env.REACT_APP_API_URL}/order/new`,
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
            withCredentials: true,
          }
        );

        navigate("/orders/success");

      } catch (error) {
        console.log("❌ ERROR:", error.response?.data || error.message);
        navigate("/orders/failed");
      }
    };

    createOrder();

  }, [shippingInfo, cartItems, navigate]);

  return <h2 className="text-center mt-20">Processing Order...</h2>;
};

export default PaymentSuccess;
