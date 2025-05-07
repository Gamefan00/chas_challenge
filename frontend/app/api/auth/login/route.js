export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log("Backend response not ok:", response.status);
      return new Response(JSON.stringify({ message: "Login failed" }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();
    console.log("Received response from backend");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
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
