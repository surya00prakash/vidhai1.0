// lib/auth/refreshAgaram.ts
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "https://devapi.agaramvidhai.in";
const VERSION = process.env.API_VERSION || "1";

export type RefreshResult =
    | { ok: true; accessToken: string | null; refreshToken: string | null; raw: any }
    | { ok: false; error: any };

export async function refreshAgaramToken(args: {
    userEmail: string;
    refreshToken: string;
    platform?: "web" | string;
    timeoutMs?: number;
}): Promise<RefreshResult> {
    const { userEmail, refreshToken, platform = "web", timeoutMs = 15000 } = args;
    const url = `${API_BASE}/web/api/v${VERSION}/Web/WebToken/Refresh`;
    try {
        const res = await axios.post(
            url,
            { userEmail, refreshToken, platform },
            { headers: { "Content-Type": "application/json" }, timeout: timeoutMs }
        );
        const d = res.data;

        const accessToken =
            d?.token?.token ??
            d?.data?.token?.token ??
            d?.token ??
            d?.accessToken ??
            d?.data?.accessToken ??
            null;

        const newRefreshToken =
            d?.token?.refreshToken?.token ??
            d?.token?.refreshToken ??
            d?.refreshToken ??
            d?.data?.refreshToken ??
            null;

        return { ok: true, accessToken, refreshToken: newRefreshToken ?? null, raw: d };
    } catch (err: any) {
        const upstream = err?.response?.data ?? err?.message ?? String(err);
        return { ok: false, error: upstream };
    }
}
