import { useEffect } from "react";
import { toast } from "sonner";

const RazorpayPayment = ({ amount, onSuccess, user, postJsonApi }) => {
  useEffect(() => {
    console.log('wk')
    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = createOrder;
    document.body.appendChild(script);
  };

  const createOrder = async () => {

    console.log('called rzp')
    try {
      // CALL BACKEND → CREATE RAZORPAY ORDER
      const res = await postJsonApi("api/create-razorpay-order", {
      amount : amount
      });

      console.log(res);

      const options = {
        key: "rzp_live_SVQwTJYIgaovzT", // replace
        amount: res.data.amount,
        currency: "INR",
        name: "uandiau",
        description: "Order Payment",
        order_id: res.data.id,

        handler: function (response) {
          // SUCCESS CALLBACK
          toast.success("Payment Successful");
          onSuccess(response);
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      toast.error("Payment Failed");
    }
  };

  return null;
};

export default RazorpayPayment;