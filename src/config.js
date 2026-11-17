// Backend base URL. Set VITE_API_URL in the hosting dashboard (or .env) for production.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
