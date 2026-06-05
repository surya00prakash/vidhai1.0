// app/api/payments/onetime-razorpay/create-onetime/route.ts
import { NextResponse } from "next/server";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return "unknown";
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    if (!body.amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }

    const { RAZORPAY_KEY_ID_1, RAZORPAY_KEY_SECRET_1 } = process.env;
    if (!RAZORPAY_KEY_ID_1 || !RAZORPAY_KEY_SECRET_1) {
      return NextResponse.json(
        { error: "Server misconfigured: missing razorpay keys" },
        { status: 500 }
      );
    }

    let Razorpay: any;
    try {
      const mod = await import("razorpay");
      Razorpay = (mod && (mod.default ?? mod)) as any;
    } catch (e) {
      return NextResponse.json(
        { error: "Server error: razorpay module import failed" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID_1,
      key_secret: RAZORPAY_KEY_SECRET_1,
    });

    const txnid = body.txnid || Date.now().toString();
    const receipt = `donation_${txnid}`;
    const amountPaise = Math.round(amount * 100);

    // 🔹 Try to find existing customer first
    let customer: any;
    try {
      const allCustomers = await razorpay.customers.all({ email: body.email });
      if (allCustomers && allCustomers.items && allCustomers.items.length > 0) {
        customer = allCustomers.items[0];
      } else {
        customer = await razorpay.customers.create({
          name: body.name,
          email: body.email,
          contact: body.phone,
        });
      }
    } catch (custErr) {
      return NextResponse.json(
        {
          error: "Failed to find or create Razorpay customer",
          details: getErrorMessage(custErr),
        },
        { status: 500 }
      );
    }

    if (!customer?.id) {
      return NextResponse.json(
        { error: "Invalid customer response from Razorpay" },
        { status: 500 }
      );
    }

    // 🔹 Create Order
    let order: any;
    try {
      order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt,
        payment_capture: 1,
        customer_id: customer.id,
        notes: {
          txnid,
          firstname: body.name || "",
          email: body.email || "",
        },
      });
    } catch (orderErr) {
      return NextResponse.json(
        {
          error: "Failed to create razorpay order",
          details: getErrorMessage(orderErr),
        },
        { status: 500 }
      );
    }

    if (!order?.id) {
      return NextResponse.json(
        { error: "Invalid order response from Razorpay" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      key: RAZORPAY_KEY_ID_1,
      amount: order.amount,
      currency: order.currency,
      txnid,
      receipt,
      customerId: customer.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error", details: getErrorMessage(err) },
      { status: 500 }
    );
  }
}
