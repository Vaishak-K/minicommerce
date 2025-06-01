"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/order/${orderId}`)
        .then((res) => res.json())
        .then(setOrder);
    }
  }, [orderId]);

  if (!order)
    return <div className="p-6 text-center">Loading order details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-6">Thank You for Your Order!</h1>
      <p
        className={`${
          order.transactionOutcome === "approved"
            ? "text-green-700"
            : "text-red-700"
        } font-semibold`}
      >
        {order.transactionOutcome === "approved"
          ? "Your payment was successful. A confirmation email has been sent."
          : order.transactionOutcome === "declined"
            ? "Your payment was declined. Please try again or contact support."
            : "There was a payment gateway error. Please try again later."}
      </p>
      <p className="mb-4">
        <strong>Order Number:</strong> {order.id}
      </p>

      <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
      <ul className="mb-4">
        <li>
          <strong>Product:</strong> {order.productTitle}
        </li>
        <li>
          <strong>Variant:</strong> {order.productVariant}
        </li>
        <li>
          <strong>Quantity:</strong> {order.productQuantity}
        </li>
        <li>
          <strong>Total:</strong> ${order.productTotal.toFixed(2)}
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
      <ul className="mb-6">
        <li>
          <strong>Name:</strong> {order.fullName}
        </li>
        <li>
          <strong>Email:</strong> {order.email}
        </li>
        <li>
          <strong>Phone:</strong> {order.phone}
        </li>
        <li>
          <strong>Address:</strong> {order.address}, {order.city}, {order.state}{" "}
          {order.zipCode}
        </li>
      </ul>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
