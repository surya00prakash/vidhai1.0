// app/api/debug/cookies/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const all: Record<string, string | undefined> = {};
    for (const [k, v] of req.cookies) {
        all[k] = v?.value;
    }
    return NextResponse.json({ serverCookies: all }, { status: 200 });
}
