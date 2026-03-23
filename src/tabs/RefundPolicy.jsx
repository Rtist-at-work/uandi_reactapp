import React from "react";

const RefundPolicy = () => {
  return (
    <div className="w-full bg-gray-50 text-gray-800 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">
          Refund & Cancellation Policy
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border text-gray-700 leading-relaxed space-y-8">

          {/* INTRO */}
          <section>
            <p>
              Thank you for shopping with us. We aim to provide the best quality products and a smooth shopping
              experience. This Refund & Cancellation Policy explains how returns, refunds, and cancellations
              work for orders placed on our platform.
            </p>
          </section>

          {/* RETURN POLICY */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Return Policy</h2>
            <p>
              You can request a return for eligible products within <span className="font-semibold">7 days of delivery</span>.
              Returned items must meet the following conditions:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Product must be unused and unwashed.</li>
              <li>Original tags, labels, and packaging must be intact.</li>
              <li>Return should include all accessories and freebies received with the product.</li>
              <li>Return must be initiated from your account under "Orders" section.</li>
            </ul>

            <p className="mt-3">
              Products that are damaged, worn, or show signs of misuse will not be accepted for return.
            </p>
          </section>

          {/* NON-RETURNABLE ITEMS */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Non-Returnable Items</h2>
            <p>The following items cannot be returned due to hygiene and safety reasons:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Innerwear & undergarments</li>
              <li>Socks</li>
              <li>Clearance or final-sale items</li>
              <li>Customized or personalized products</li>
            </ul>
          </section>

          {/* REFUND PROCESS */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Refund Process</h2>
            <p>Once we receive and inspect the returned product, your refund will be processed within:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><span className="font-semibold">3–7 business days</span> for Wallet/UPI/Bank Account refunds</li>
              <li><span className="font-semibold">7–10 business days</span> for Credit/Debit Card refunds</li>
            </ul>

            <p className="mt-3">
              You will receive a confirmation message once the refund is processed. Refund will be initiated 
              to the original payment method used during purchase.
            </p>
          </section>

          {/* EXCHANGE POLICY */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Exchange Policy</h2>
            <p>
              Exchange is available only for size and color variants, depending on stock availability. 
              If the requested variant is unavailable, a refund will be issued instead.
            </p>
          </section>

          {/* ORDER CANCELLATION */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Order Cancellation</h2>
            <p>You may cancel your order under the following conditions:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Order can be cancelled before it is shipped.</li>
              <li>Once shipped, cancellation is not possible. You may request a return after delivery.</li>
            </ul>

            <p className="mt-3">
              If payment was already made, the full amount will be refunded back to your original
              payment method upon successful cancellation.
            </p>
          </section>

          {/* DAMAGED OR WRONG PRODUCT */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Damaged / Wrong Product Received</h2>
            <p>If you receive a damaged or incorrect product, you must:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Raise a complaint within <span className="font-semibold">48 hours</span> of delivery.</li>
              <li>Upload clear product images and packaging photos.</li>
            </ul>

            <p className="mt-3">We will verify and quickly arrange a replacement or refund.</p>
          </section>

          {/* CONTACT SUPPORT */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Support</h2>
            <p>
              For any refund, return, or cancellation queries, contact our support team:
            </p>

            <ul className="mt-3 space-y-1">
              <li>📧 Email: <span className="font-semibold">support@yourstore.com</span></li>
              <li>📞 Phone: <span className="font-semibold">+91 98765 43210</span></li>
              <li>🕒 Support Hours: 10:00 AM – 7:00 PM (Mon–Sat)</li>
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;
