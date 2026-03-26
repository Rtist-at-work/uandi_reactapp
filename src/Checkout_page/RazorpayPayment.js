export const openRazorpay = async ({
  amount,
  user,
  postJsonApi,
  onSuccess,
}) => {
  try {
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    const res = await postJsonApi("api/create-razorpay-order", {
      amount,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: res.data.amount,
      currency: "INR",
      name: "uandi",
      description: "Order Payment",
      order_id: res.data.id,
      image: "/uandi.png",

      handler: function (response) {
        onSuccess(response);
      },

      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
        },
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      toast.error(response.error.description || "Payment Failed");
    });

    rzp.open();
  } catch (err) {
    console.log(err);
    toast.error("Payment failed to start");
  }
};
