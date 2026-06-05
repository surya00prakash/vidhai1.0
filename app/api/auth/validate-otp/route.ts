// app/api/auth/validate-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const API_VERSION = process.env.API_VERSION || "1";
const VALIDATE_URL = `${API_BASE}/web/api/v${API_VERSION}/Web/ValidateWebOtp`;
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "agaram_refresh";

function mask(s: any) {
    try {
        const str = typeof s === "string" ? s : JSON.stringify(s);
        if (str.length <= 120) return str;
        return `${str.slice(0, 60)}...${str.slice(-40)}`;
    } catch {
        return String(s);
    }
}

export async function POST(req: NextRequest) {
    try {
        // parse body safely
        const body = await req.json().catch(() => null);

        // quick input validation
        if (!body || !body.contactType || !body.contactValue) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: contactType and contactValue" },
                { status: 400 }
            );
        }

        // LOG what we will call (helps with Invalid URL)

        // call upstream
        const upstream = await axios.post(VALIDATE_URL, body, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });

        const data = upstream.data;

        // defensive extraction of tokens & userId
        const accessToken =
            data?.token?.token ?? data?.token ?? data?.accessToken ?? data?.data?.accessToken ?? null;

        const refreshToken =
            data?.token?.refreshToken?.token ??
            data?.token?.refreshToken ??
            data?.refreshToken ??
            data?.data?.refreshToken ??
            null;

        const userId = data?.userId ?? data?.id ?? data?.data?.userId ?? null;

        // response to client
        const res = NextResponse.json({ success: true, accessToken, userId, raw: data }, { status: upstream.status });

        // set HttpOnly cookie for refresh token (if upstream provided it)
        if (refreshToken) {
            const userEmail = data?.userEmail ?? body?.contactValue ?? null;
            const cookiePayload = encodeURIComponent(JSON.stringify({ refreshToken, userEmail }));
            res.cookies.set(COOKIE_NAME, cookiePayload, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 90,
            });
            res.headers.set("x-debug-refresh-set", "1");
        } else {
        }

        return res;
    } catch (err: any) {
        // differentiate URL build errors vs axios errors
        const isInvalidUrl = err?.message && String(err.message).toLowerCase().includes("invalid url");
        if (isInvalidUrl) {
            return NextResponse.json({ success: false, message: "Invalid URL when calling upstream ValidateWebOtp", details: { API_BASE, VALIDATE_URL } }, { status: 500 });
        }

        const upstreamBody = err?.response?.data ?? null;
        const status = err?.response?.status ?? 500;
        return NextResponse.json({ success: false, message: "validate-otp proxy error", upstreamStatus: status, upstreamBody }, { status: status === 500 ? 502 : status });
    }
}
