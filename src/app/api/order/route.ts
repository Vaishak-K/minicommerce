import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

import { sendApprovedEmail, sendFailedEmail } from "@/lib/email";

const OrderSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  id: z.string().min(1, "Product ID is required"),
  title: z.string().min(1, "Product title is required"),
  variant: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
  transactionOutcome: z.enum(["approved", "failed"], {
    errorMap: () => ({
      message: "Transaction outcome must be 'approved' or 'failed'",
    }),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();

  const parsed = OrderSchema.safeParse(json);

  // If validation fails, return field-specific errors
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ errors }, { status: 400 });
  }

  const data = parsed.data;
  const orderNumber = `ORD-${Date.now()}`;

  try {
    // Store order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        productId: data.id,
        productTitle: data.title,
        productVariant: data.variant || "",
        productQuantity: data.quantity,
        productPrice: data.price,
        productTotal: data.price * data.quantity,
        transactionOutcome: data.transactionOutcome,
      },
    });

    // Send email based on transaction outcome
    if (data.transactionOutcome === "approved") {
      await sendApprovedEmail(order);
    } else {
      await sendFailedEmail(order);
    }

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
