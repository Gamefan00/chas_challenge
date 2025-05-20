// utility functions for managing cookies and session
const COOKIE_CONSENT_KEY = "cookiesAccepted";
const SESSION_TOKEN_KEY = "session-token";

// Set a cookie with the given name and value
export const setCookie = (name, value, days = 30) => {
  try {
    // For client-side storage, use localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

// Get a cookie by name
export const getCookie = (name) => {
  try {
    // For client-side access
    if (typeof window !== "undefined") {
      return localStorage.getItem(name);
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

// Delete a cookie by name
export const deleteCookie = (name) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(name);
    }
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

// Check if user has accepted cookies

export const hasAcceptedCookies = () => {
  return getCookie(COOKIE_CONSENT_KEY) === "true";
};

// Set cookie consent
export const setCookieConsent = (accepted) => {
  setCookie(COOKIE_CONSENT_KEY, accepted ? "true" : "false");
};

// Save session token (only if cookies are accepted)

export const saveSessionToken = (token) => {
  if (hasAcceptedCookies()) {
    setCookie(SESSION_TOKEN_KEY, token);
    return true;
  }
  return false;
};

export const getSessionToken = () => {
  return getCookie(SESSION_TOKEN_KEY);
};

// Clear session
export const clearSession = () => {
  deleteCookie(SESSION_TOKEN_KEY);
};
