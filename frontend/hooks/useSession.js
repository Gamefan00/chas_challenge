"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  saveSessionToken,
  getSessionToken,
  clearSession,
  hasAcceptedCookies,
} from "@/lib/cookie-utils";

// Custom hook for session management

export const useSession = () => {
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on client-side
  useEffect(() => {
    // Try to get existing session token
    const existingToken = getSessionToken();

    if (existingToken) {
      setSessionToken(existingToken);
    } else {
      // Create a new session token if user has accepted cookies
      if (hasAcceptedCookies()) {
        const newToken = uuidv4();
        saveSessionToken(newToken);
        setSessionToken(newToken);
      }
    }

    setIsLoading(false);
  }, []);

  // Create new session
  const createSession = () => {
    if (hasAcceptedCookies()) {
      const newToken = uuidv4();
      saveSessionToken(newToken);
      setSessionToken(newToken);
      return newToken;
    }
    return null;
  };

  // End session
  const endSession = () => {
    clearSession();
    setSessionToken(null);
  };

  return {
    sessionToken,
    isLoading,
    hasSession: !!sessionToken,
    createSession,
    endSession,
  };
};
