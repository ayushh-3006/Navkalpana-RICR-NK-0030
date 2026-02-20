export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function safeParse(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function postFormData(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await safeParse(res);
  if (!res.ok) throw new Error(data?.message || "Upload failed");
  return data;
}

export async function getJSON(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await safeParse(res);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}