// app/api/auth/revoke/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const VERSION = process.env.API_VERSION || "1";
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "agaram_refresh";

function mask(t?: string | null) {
    if (!t) return null;
    if (t.length <= 12) return t;
    return t.slice(0, 8) + "..." + t.slice(-6);
}

export async function POST(req: NextRequest) {
    try {
        const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
        if (!cookieVal) {
            // nothing to revoke upstream; ensure cookie cleared client-side
            const res = NextResponse.json({ success: true, message: "No refresh cookie present; nothing to revoke" });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        let parsed: { refreshToken?: string; userEmail?: string } | null = null;
        try {
            parsed = JSON.parse(decodeURIComponent(cookieVal));
        } catch {
            const res = NextResponse.json({ success: true, message: "Malformed cookie cleared" });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        const { refreshToken, userEmail } = parsed ?? {};
        if (!refreshToken) {
            const res = NextResponse.json({ success: true, message: "No refresh token found in cookie; cleared" });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        // call upstream revoke
        const revokeUrl = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Revoke`;
        try {
            const upr = await axios.post(
                revokeUrl,
                { refreshToken, userEmail, platform: "web" },
                { headers: { "Content-Type": "application/json" }, timeout: 10000 }
            );

            const res = NextResponse.json({ success: true, message: "Revoked upstream and cleared cookie", upstream: upr.data ?? null });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        } catch (upErr: any) {
            // still clear cookie locally to end local session
            const res = NextResponse.json({ success: false, message: "Upstream revoke failed; cookie cleared locally", upstream: upErr?.response?.data ?? upErr?.message ?? null }, { status: 502 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }
    } catch (err: any) {
        const res = NextResponse.json({ success: false, message: "Server error during revoke" }, { status: 500 });
        res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
        return res;
    }
}
