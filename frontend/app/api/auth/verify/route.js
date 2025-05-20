export async function GET(request) {
  const BASE_URL = process.env.API_URL || "http://localhost:4000";

  try {
    const response = await fetch(`${BASE_URL}/auth/verify-admin`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: request.headers.get("cookie") || "", // Forward cookies
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Verification failed with status:", response.status);
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        isAdmin: data.isAdmin,
        user: data.user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Verification API error:", error);
    return new Response(
      JSON.stringify({
        authenticated: false,
        error: "Authentication check failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
