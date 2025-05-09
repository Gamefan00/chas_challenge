import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Protected paths
  const isAdminPath = path.startsWith("/admin");

  // Check for the cookie
  const authCookie = request.cookies.get("authToken");

  // Restrict access to Admin if no cookie exists
  if (isAdminPath && !authCookie) {
    // Redirect to login
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Continue to the protected route
  return NextResponse.next();
}

// protect all /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
