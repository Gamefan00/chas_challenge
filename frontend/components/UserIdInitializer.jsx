"use client";

import { useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function UserIdInitializer() {
  useEffect(() => {
    async function fetchUserId() {
      // Get UserId from localstorage
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) console.log("UserId found:", storedUserId);

      // If no userId is in localstorage -> Get new UserId from backend
      if (!storedUserId) {
        try {
          const response = await fetch(`${BASE_URL}/getUserId`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const data = await response.json();

          localStorage.setItem("userId", data.userId);
          console.log("New UserId gotten from backend:", data.userId);
        } catch (error) {
          console.error("Error fetching userId:", error);
        }
      }
    }

    fetchUserId();
  }, []);

  return null;
}
