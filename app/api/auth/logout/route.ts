// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const VERSION = process.env.API_VERSION || "1";
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "agaram_refresh";

export async function POST(req: NextRequest) {
    try {
        // Read refresh cookie
        const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
        if (!cookieVal) {
            // still clear any cookie on client
            const res = NextResponse.json({ success: true, message: "No refresh cookie present; cleared client." });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        let parsed: { refreshToken?: string; userEmail?: string } | null = null;
        try {
            parsed = JSON.parse(decodeURIComponent(cookieVal));
        } catch {
            // malformed: just delete cookie
            const res = NextResponse.json({ success: true, message: "Malformed cookie cleared" });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        const { refreshToken, userEmail } = parsed ?? {};
        if (!refreshToken) {
            const res = NextResponse.json({ success: true, message: "No refresh token in cookie; cleared" });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        // Call upstream revoke (logout) endpoint
        const revokeUrl = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Revoke`;
        try {
            const upr = await axios.post(
                revokeUrl,
                { refreshToken, userEmail, platform: "web" },
                { headers: { "Content-Type": "application/json" }, timeout: 10000 }
            );
            // regardless of upstream body, clear cookie for the client
            const res = NextResponse.json({ success: true, message: "Revoked upstream and cleared cookie", upstream: upr.data ?? null });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        } catch (upErr: any) {
            // upstream revoke failed — still clear cookie locally to log user out of client
            const res = NextResponse.json({ success: false, message: "Upstream revoke failed; cookie cleared locally", upstream: upErr?.response?.data ?? upErr?.message ?? null }, { status: 502 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }
    } catch (err: any) {
        const res = NextResponse.json({ success: false, message: "Server error during logout" }, { status: 500 });
        res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
        return res;
    }
}
