"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [transactionOutcome, setTransactionOutcome] = useState("approved");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedProduct");
    if (stored) setProduct(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const customerData = Object.fromEntries(formData.entries());

    const payload = {
      ...customerData,
      ...product,
      transactionOutcome,
    };

    const res = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const result = await res.json();

      if (res.status === 400 && result.errors) {
        setFieldErrors(result.errors); // Zod field errors
      } else {
        setServerError(result.error || "An unexpected error occurred.");
      }

      return;
    }

    const { orderId } = await res.json();
    router.push(`/thank-you?orderId=${orderId}`);
  };

  if (!product)
    return <div className="p-6 text-center">Loading product...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 space-y-4 bg-white shadow mt-8 rounded"
    >
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {serverError && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{serverError}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input
            name="fullName"
            placeholder="Full Name"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.fullName && (
            <p className="text-sm text-red-600">{fieldErrors.fullName[0]}</p>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-600">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <input
            name="phone"
            placeholder="Phone"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-600">{fieldErrors.phone[0]}</p>
          )}
        </div>

        <div>
          <input
            name="address"
            placeholder="Address"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.address && (
            <p className="text-sm text-red-600">{fieldErrors.address[0]}</p>
          )}
        </div>

        <div>
          <input
            name="city"
            placeholder="City"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.city && (
            <p className="text-sm text-red-600">{fieldErrors.city[0]}</p>
          )}
        </div>

        <div>
          <input
            name="state"
            placeholder="State"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.state && (
            <p className="text-sm text-red-600">{fieldErrors.state[0]}</p>
          )}
        </div>

        <div>
          <input
            name="zipCode"
            placeholder="Zip Code"
            required
            className="border p-3 rounded w-full"
          />
          {fieldErrors.zipCode && (
            <p className="text-sm text-red-600">{fieldErrors.zipCode[0]}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="cardNumber"
          placeholder="Card Number"
          required
          className="border p-3 rounded"
          minLength={16}
          maxLength={16}
        />
        <input
          name="expiryDate"
          placeholder="Expiry Date"
          required
          className="border p-3 rounded"
        />
        <input
          name="cvv"
          placeholder="CVV"
          required
          minLength={3}
          maxLength={3}
          className="border p-3 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Simulate Transaction Outcome
        </label>
        <select
          value={transactionOutcome}
          onChange={(e) => setTransactionOutcome(e.target.value)}
          className="w-full mt-1 border p-3 rounded"
        >
          <option value="approved">✅ Approved</option>
          <option value="declined">❌ Declined</option>
          <option value="failed">⚠️ Gateway Failure</option>
        </select>
      </div>

      <div className="p-4 bg-gray-50 rounded">
        <h2 className="font-semibold text-lg">Order Summary</h2>
        <p>
          <strong>Product:</strong> {product.title}
        </p>
        <p>
          <strong>Variant:</strong> {product.variant}
        </p>
        <p>
          <strong>Quantity:</strong> {product.quantity}
        </p>
        <p>
          <strong>Total:</strong> $
          {(product.price * product.quantity).toFixed(2)}
        </p>
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded">
        Submit Order
      </button>
    </form>
  );
}
