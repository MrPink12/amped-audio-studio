// Centralized API client for Vunox backend

const API_BASE = ""; // Same origin; adjust if backend is on a different host/port

export async function deleteHistoryItem(id: string, fileName?: string): Promise<void> {
  // TODO: adjust endpoint path once backend confirms exact route
  // Option A: DELETE /history/item/<id>
  // Option B: DELETE /assets/delete?file_name=...
  const res = await fetch(`${API_BASE}/history/item/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Delete failed: ${res.status}`);
  }
}

export function getDownloadUrl(fileName: string): string {
  return `${API_BASE}/assets/download?file_name=${encodeURIComponent(fileName)}`;
}
