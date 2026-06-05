import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const MIN_AMOUNT = 100;
const MAX_DURATION = 100;

export async function POST(req: NextRequest) {
    try {
        const { amount, duration } = await req.json();

        const parsedAmount = Number(amount);
        const parsedDuration = Number(duration);

        if (!parsedAmount || parsedAmount < MIN_AMOUNT) {
            return NextResponse.json({ error: "Amount must be at least ₹100." }, { status: 400 });
        }

        if (!parsedDuration || parsedDuration < 1 || parsedDuration > MAX_DURATION) {
            return NextResponse.json({ error: "Duration must be between 1 and 100 months." }, { status: 400 });
        }

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
        }

        const razorpay = new Razorpay({ key_id, key_secret });

        const plan = await razorpay.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "Agaram Monthly Donation",
                amount: parsedAmount * 100, // in paise
                currency: "INR",
                description: "Recurring donation to support students",
            },
        });

        const startDate = new Date();
        const firstBillingDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 2);
        const start_at = Math.floor(firstBillingDate.getTime() / 1000);

        const subscription = await razorpay.subscriptions.create({
            plan_id: plan.id,
            total_count: parsedDuration,
            customer_notify: 1,
        });

        return NextResponse.json(subscription);
    } catch (error) {
        return NextResponse.json({ error: "Unable to process subscription." }, { status: 500 });
    }
}
