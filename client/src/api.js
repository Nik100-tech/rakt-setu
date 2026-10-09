const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const api = {
  createDonor: body => request("/donors", { method: "POST", body: JSON.stringify(body) }),
  getDonor: token => request(`/donors/${encodeURIComponent(token)}`),
  getDonors: () => request("/donors"),
  setDonorStatus: (token, status) => request(`/donors/${encodeURIComponent(token)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  createRequest: body => request("/requests", { method: "POST", body: JSON.stringify(body) }),
  getRequests: () => request("/requests"),
  getRequest: token => request(`/requests/${encodeURIComponent(token)}`),
  getStats: () => request("/stats"),
  getActivity: () => request("/activity"),
  idCardUrl: token => `${API}/donors/${encodeURIComponent(token)}/id-card`
};
