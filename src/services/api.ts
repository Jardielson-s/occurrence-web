import type { Occurrence, Status } from "../types/occurrence";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message ?? body.error ?? msg;
    } catch {
      // resposta sem corpo JSON: mantém a mensagem padrão
    }
    throw new Error(res.status === 409 ? `Transição inválida: ${msg}` : msg);
  }
  return res.json();
}

export async function listOccurrences(status?: Status): Promise<Occurrence[]> {
  const qs = status ? `?status=${status}` : "";
  const data = await request<Occurrence[] | { data: Occurrence[] }>(
    `/occurrences${qs}`
  );
  return Array.isArray(data) ? data : data.data;
}

export function changeStatus(id: string, status: Status, note?: string) {
  return request<Occurrence>(`/occurrences/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(note ? { status, note } : { status }),
  });
}
