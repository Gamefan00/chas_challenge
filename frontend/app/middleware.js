import { NextResponse } from "next/server";

export function middleware(request) {
  // Check for the cookie
  const authCookie = request.cookies.get("authToken");

  if (!authCookie) {
    // If no cookie is found, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue to the protected route
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
