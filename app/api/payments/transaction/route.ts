// app/api/payments/transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const VERSION = process.env.API_VERSION || "1";
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "agaram_refresh";

function safeParseCookie(val?: string) {
    if (!val) return null;
    try {
        return JSON.parse(decodeURIComponent(val));
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const transactionId = body?.transactionId;
        if (!transactionId) {
            return NextResponse.json({ success: false, message: "transactionId required" }, { status: 400 });
        }

        // read refresh cookie
        const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
        if (!cookieVal) {
            return NextResponse.json({ success: false, message: "No refresh cookie" }, { status: 401 });
        }
        const parsed = safeParseCookie(cookieVal);
        const refreshToken = parsed?.refreshToken ?? null;
        const userEmail = parsed?.userEmail ?? null;
        if (!refreshToken || !userEmail) {
            return NextResponse.json({ success: false, message: "Invalid refresh cookie" }, { status: 401 });
        }

        // Refresh access token upstream
        const refreshUrl = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Refresh`;
        const refreshRes = await axios.post(
            refreshUrl,
            { userEmail, refreshToken, platform: "web" },
            { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        );

        const tokenData = refreshRes.data;
        const accessToken = tokenData?.token?.token ?? tokenData?.token ?? tokenData?.accessToken ?? null;
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Refresh returned no access token", upstream: tokenData },
                { status: 401 }
            );
        }

        // call transaction details endpoint (the swagger shows GET /GetWebPaymentDetailsByTransactionIdAsync/{id})
        const detailUrl = `${API_BASE}/web/api/v${VERSION}/Web/GetWebPaymentDetailsByTransactionIdAsync/${encodeURIComponent(
            transactionId
        )}`;

        const upstreamRes = await axios.get(detailUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
            timeout: 10000,
        });

        return NextResponse.json(upstreamRes.data, { status: upstreamRes.status });
    } catch (err: any) {
        const upstream = err?.response?.data ?? null;
        const status = err?.response?.status ?? 500;
        return NextResponse.json(
            { success: false, message: "Transaction details upstream error", upstream },
            { status }
        );
    }
}
