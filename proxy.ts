import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication (checked client-side via AuthContext,
// but middleware provides an early redirect for a better UX)
const PROTECTED_ROUTES = ["/profile"];

// Routes that authenticated users should NOT visit (e.g. login page)
const AUTH_ROUTES = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We check for the auth storage key in cookies. Since the app uses
  // localStorage (agaram_auth_data), we cannot read it in middleware.
  // Instead, we use a lightweight cookie flag that gets set on login.
  const hasAuthCookie = request.cookies.has("agaram_logged_in");

  // Protect authenticated routes — redirect to login if no auth cookie
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login"],
};
