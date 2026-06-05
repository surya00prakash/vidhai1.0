// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const API_VERSION = process.env.API_VERSION || "1";
const SIGNUP_URL = `${API_BASE}/web/api/v${API_VERSION}/Web/SignUpWebUser`;

function safeMask(s: string | null | undefined) {
    if (!s) return null;
    return s.length > 12 ? s.slice(0, 8) + "..." + s.slice(-4) : s;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);

        // quick sanity check of input
        if (!body || (!body.name && !body.email && !body.phoneNumber)) {
            return NextResponse.json(
                { success: false, message: "Missing body or required fields (name/email/phoneNumber)" },
                { status: 400 }
            );
        }


        const upstream = await axios.post(SIGNUP_URL, body, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });


        return NextResponse.json(upstream.data, { status: upstream.status });
    } catch (err: any) {
        // Helpful logging for debugging: server console will show this
        const status = err?.response?.status ?? 500;
        const upstreamData = err?.response?.data ?? null;

        // Return a useful error to client (do not leak secrets)
        return NextResponse.json(
            { success: false, message: "Signup proxy error", upstreamStatus: status, upstreamBody: upstreamData },
            { status: status === 500 ? 502 : status }
        );
    }
}
