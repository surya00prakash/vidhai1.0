// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const API_VERSION = process.env.API_VERSION || "1";
const SEND_OTP_URL = `${API_BASE}/web/api/v${API_VERSION}/Web/SendWebOtp`;

function safeMask(s: any) {
    try {
        const str = typeof s === "string" ? s : JSON.stringify(s);
        if (str.length <= 80) return str;
        return str.slice(0, 40) + "..." + str.slice(-20);
    } catch {
        return String(s);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);

        // minimal validation
        if (!body || !body.contactType || !body.contactValue) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: contactType and contactValue (e.g. { contactType: 'Email', contactValue: 'you@example.com' })",
                },
                { status: 400 }
            );
        }


        const upstream = await axios.post(SEND_OTP_URL, body, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });

        return NextResponse.json(upstream.data, { status: upstream.status });
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const upstreamBody = err?.response?.data ?? null;

        return NextResponse.json(
            { success: false, message: "Send-OTP proxy error", upstreamStatus: status, upstreamBody },
            { status: status === 500 ? 502 : status }
        );
    }
}
