const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("library_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      `Cannot reach the library API at ${API_URL}. Start the backend with "npm run dev" and check its MySQL connection.`
    );
  }
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("library_token");
      localStorage.removeItem("library_user");
      window.dispatchEvent(new Event("library:logout"));
    }
    throw new Error(data?.message || "The request could not be completed.");
  }
  return data;
}
