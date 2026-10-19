import { useCallback, useEffect, useState } from 'react';
import type { MistakeItem, MistakeStatus } from '../types';
import { dbGetAllMistakes, dbSaveMistake, dbDeleteMistake } from '../lib/db';

export function useMistakes() {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await dbGetAllMistakes();
    all.sort((a, b) => b.createdAt - a.createdAt);
    setMistakes(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (item: MistakeItem) => {
    await dbSaveMistake(item);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await dbDeleteMistake(id);
    await refresh();
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: MistakeStatus) => {
    const target = mistakes.find((m) => m.id === id);
    if (!target) return;
    await dbSaveMistake({
      ...target,
      status,
      reviewCount: target.reviewCount + 1,
    });
    await refresh();
  }, [mistakes, refresh]);

  return { mistakes, loading, save, remove, updateStatus, refresh };
}
