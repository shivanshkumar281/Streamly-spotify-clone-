// Base URL of the backend API.
// - In development we default to the local server on port 4000.
// - In production set VITE_API_URL to your deployed backend.
// The player still falls back to bundled demo data if the API is unreachable.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Password required to open the admin panel. Override via VITE_ADMIN_PASSWORD.
export const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || "Redn1nja";
