import { useCallback, useState } from 'react';

// 组卷篮状态：在卡片上一道勾选，或批量按筛选结果加入
export function useBasket() {
  const [basketIds, setBasketIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setBasketIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addMany = useCallback((ids: string[]) => {
    setBasketIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const removeMany = useCallback((ids: string[]) => {
    setBasketIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clear = useCallback(() => setBasketIds(new Set()), []);

  const has = useCallback((id: string) => basketIds.has(id), [basketIds]);

  return {
    basketIds,
    count: basketIds.size,
    toggle,
    addMany,
    removeMany,
    clear,
    has,
  };
}
