import { NextResponse } from "next/server";

// Middleware function to handle requests
export function middleware(request) {
  // Retrieve the "authToken" cookie from the request
  const token = request.cookies.get("authToken")?.value;

  // If the token is not present, redirect the user to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the token exists, allow the request to proceed to the protected route
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  // Apply the middleware to all routes under "/admin"
  matcher: ["/admin/:path*"],
};
