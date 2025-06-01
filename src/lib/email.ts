import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "examplemail@example.com";

export async function sendApprovedEmail(order: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `<h1>Thank you for your order!</h1>
           <p>Your order <strong>${order.orderNumber}</strong> has been approved.</p>
           <p>Product: ${order.productTitle} (${order.productVariant})</p>
           <p>Quantity: ${order.productQuantity}</p>
           <p>Total: $${order.productTotal.toFixed(2)}</p>
           <p>We appreciate your business!</p>`,
  });
}

export async function sendFailedEmail(order: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: `Order Payment Failed - ${order.orderNumber}`,
    html: `<h1>Payment Failure Notice</h1>
           <p>Unfortunately, your payment for order <strong>${order.orderNumber}</strong> was not successful.</p>
           <p>Please try again or contact support if you need assistance.</p>`,
  });
}
