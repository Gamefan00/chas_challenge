export async function POST(request) {
  const BASE_URL = process.env.API_URL || "http://localhost:4000";

  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    // Get cookies from response to forward them to the client
    const setCookieHeader = response.headers.get("set-cookie");
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // Forward set-cookie header if it exists
    if (setCookieHeader) {
      headers.set("Set-Cookie", setCookieHeader);
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
