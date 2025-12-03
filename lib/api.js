// lib/api.js
export function apiUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in .env.local");
  }

  // remove extra slashes at the end
  const baseClean = base.replace(/\/+$/, "");

  // ensure path starts with "/"
  const suffix = path.startsWith("/") ? path : `/${path}`;

  return `${baseClean}${suffix}`;
}

export async function fetchJson(path, opts = {}) {
  const url = apiUrl(path);

  // -----------------------------
  // 1️⃣ ADD TOKEN AUTOMATICALLY
  // -----------------------------
  let headers = opts.headers || {};
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // keep existing headers (like Content-Type)
  opts.headers = headers;

  // -----------------------------
  // 2️⃣ FETCH THE REQUEST
  // -----------------------------
  const res = await fetch(url, opts);

  // -----------------------------
  // 3️⃣ HANDLE INVALID TOKEN (401)
  // -----------------------------
  if (res.status === 401) {
    // token is dead, remove it
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    // redirect to login safely
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }

    throw new Error("Unauthorized: Token invalid or expired");
  }

  // -----------------------------
  // 4️⃣ HANDLE OTHER ERRORS
  // -----------------------------
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`API error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}
