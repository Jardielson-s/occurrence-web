import { useCallback, useEffect, useState } from "react";
import { changeStatus, listOccurrences } from "../services/api";
import type { Occurrence, Status } from "../types/occurrence";

export function useOccurrences() {
  const [filter, setFilter] = useState<Status | "">("");
  const [items, setItems] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listOccurrences(filter || undefined));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (id: string, status: Status, note?: string) => {
      setBusyId(id);
      try {
        await changeStatus(id, status, note);
        await load();
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  return {
    items,
    loading,
    error,
    busyId,
    filter,
    setFilter,
    acknowledge: (id: string) => update(id, "acknowledged"),
    resolve: (id: string, note: string) => update(id, "resolved", note),
  };
}
