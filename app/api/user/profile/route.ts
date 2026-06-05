// app/api/user/profile/route.ts
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
        const body = await req.json();
        const userId = body?.userId;
        if (!userId) {
            return NextResponse.json({ success: false, message: "userId required in request body" }, { status: 400 });
        }

        // Read refresh cookie
        const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
        if (!cookieVal) {
            return NextResponse.json({ success: false, message: "No refresh cookie present. Please login (validate OTP) first." }, { status: 401 });
        }

        // Parse cookie (we store encodeURIComponent(JSON.stringify({ refreshToken, userEmail })))
        let parsed: { refreshToken?: string; userEmail?: string } | null = null;
        try {
            parsed = JSON.parse(decodeURIComponent(cookieVal));
        } catch (e) {
            // malformed cookie: clear it and force re-login
            const res = NextResponse.json({ success: false, message: "Malformed refresh cookie. Please login again." }, { status: 401 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        const { refreshToken, userEmail } = parsed ?? {};
        if (!refreshToken || !userEmail) {
            const res = NextResponse.json({ success: false, message: "Refresh cookie missing required fields (refreshToken/userEmail)." }, { status: 401 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        // Call upstream refresh to obtain access token
        const refreshUrl = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Refresh`;
        let accessToken: string | null = null;
        let newRefreshToken: string | null = null;
        try {
            const r = await axios.post(
                refreshUrl,
                { userEmail, refreshToken, platform: "web" },
                { headers: { "Content-Type": "application/json" }, timeout: 15000 }
            );

            const tokenData = r.data ?? {};
            accessToken = tokenData?.token?.token ?? tokenData?.token ?? tokenData?.accessToken ?? null;
            newRefreshToken = tokenData?.token?.refreshToken?.token ?? tokenData?.refreshToken ?? null;

            // rotate refresh cookie if upstream returned new refresh token
            if (newRefreshToken) {
                const cookieValue = encodeURIComponent(JSON.stringify({ refreshToken: newRefreshToken, userEmail }));
                const res = NextResponse.json({ success: true, message: "Refreshed token (rotated cookie)", raw: tokenData });
                res.cookies.set({
                    name: COOKIE_NAME,
                    value: cookieValue,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 90,
                });
                // continue: we still need to call profile; but we can't return early because client expects profile object
            } else {
                // no new refresh token — keep cookie unchanged
            }
        } catch (upErr: any) {
            // clear cookie to avoid stuck invalid refresh token
            const res = NextResponse.json({ success: false, message: "Refresh returned no access token or failed", upstream: upErr?.response?.data ?? upErr?.message ?? null }, { status: upErr?.response?.status ?? 502 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        if (!accessToken) {
            const res = NextResponse.json({ success: false, message: "Refresh returned no access token" }, { status: 401 });
            res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
            return res;
        }

        // Call profile endpoint using the freshly obtained access token
        const profileUrl = `${API_BASE}/web/api/v${VERSION}/Web/GetWebUserProfileBasedOnUserIdAsync/${encodeURIComponent(userId)}`;
        try {
            // upstream expects GET (Swagger indicates GET); if your upstream needs POST, change to axios.post(profileUrl, {}, { headers: ... })
            const profileRes = await axios.get(profileUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            });

            // If we rotated the refresh cookie earlier, we already set it in NextResponse above.
            // Here we want to return the profile. If we set cookie earlier we returned that response object — but we still need to return the profile body.
            // So construct a response that keeps cookie rotation if it happened.
            const respBody = profileRes.data ?? null;
            // Build response: if we rotated refresh token, include cookie; otherwise simple JSON
            if (newRefreshToken) {
                const res = NextResponse.json(respBody, { status: profileRes.status });
                // ensure cookie value updated (same as earlier rotation)
                const cookieValue = encodeURIComponent(JSON.stringify({ refreshToken: newRefreshToken, userEmail }));
                res.cookies.set({
                    name: COOKIE_NAME,
                    value: cookieValue,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 90,
                });
                return res;
            }

            return NextResponse.json(respBody, { status: profileRes.status });
        } catch (profErr: any) {
            const message = profErr?.response?.data ?? profErr?.message ?? "Profile upstream error";
            return NextResponse.json({ success: false, message: "Profile upstream error", upstream: message }, { status: profErr?.response?.status ?? 502 });
        }
    } catch (err: any) {
        return NextResponse.json({ success: false, message: "Server error while loading profile" }, { status: 500 });
    }
}
