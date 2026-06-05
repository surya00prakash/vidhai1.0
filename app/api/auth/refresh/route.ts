// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const VERSION = process.env.API_VERSION || "1";
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "agaram_refresh";

// small helper to avoid leaking full tokens in logs
function mask(t?: string | null) {
    if (!t) return null;
    if (t.length <= 12) return t;
    return t.slice(0, 8) + "..." + t.slice(-6);
}

export async function POST(req: NextRequest) {
    try {
        // read refresh cookie
        const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
        if (!cookieVal) {
            return NextResponse.json({ success: false, message: "No refresh cookie" }, { status: 401 });
        }

        let parsed: { refreshToken?: string; userEmail?: string } | null = null;
        try {
            parsed = JSON.parse(decodeURIComponent(cookieVal));
        } catch (e) {
            // clear cookie to avoid repeated errors
            const bad = NextResponse.json({ success: false, message: "Malformed refresh cookie" }, { status: 401 });
            bad.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return bad;
        }

        const { refreshToken, userEmail } = parsed ?? {};
        if (!refreshToken || !userEmail) {
            // nothing to refresh
            const res = NextResponse.json({ success: false, message: "Missing fields in refresh cookie" }, { status: 401 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        // call upstream refresh endpoint
        const refreshUrl = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Refresh`;
        try {
            const upr = await axios.post(
                refreshUrl,
                { userEmail, refreshToken, platform: "web" },
                { headers: { "Content-Type": "application/json" }, timeout: 15000 }
            );

            const body = upr.data ?? {};
            // extract access token (upstream can return different shapes)
            const accessToken = body?.token?.token ?? body?.token ?? body?.accessToken ?? null;
            const newRefreshToken = body?.token?.refreshToken?.token ?? body?.refreshToken ?? null;

            // rotate refresh cookie if upstream issued a new refresh token
            const res = NextResponse.json({ success: true, accessToken: accessToken ?? null, raw: body }, { status: upr.status });

            if (newRefreshToken) {
                // store as encoded JSON { refreshToken, userEmail } to preserve the email in cookie (consistent with validate-otp)
                const cookieValue = encodeURIComponent(JSON.stringify({ refreshToken: newRefreshToken, userEmail }));
                res.cookies.set({
                    name: COOKIE_NAME,
                    value: cookieValue,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 90, // 90 days
                });
            } else {
                // If not rotating, keep existing cookie untouched (or you may want to refresh expiry)
            }

            return res;
        } catch (upErr: any) {
            // don't leak upstream internals to client; forward useful info
            const status = upErr?.response?.status ?? 502;
            const data = upErr?.response?.data ?? { message: "Upstream refresh error" };
            // clear cookie on unrecoverable refresh failure to force re-login
            const res = NextResponse.json({ success: false, message: "Refresh failed", upstream: data }, { status });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }
    } catch (err: any) {
        const res = NextResponse.json({ success: false, message: "Server error during refresh" }, { status: 500 });
        return res;
    }
}
