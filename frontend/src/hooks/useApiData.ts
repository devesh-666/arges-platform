import { useCallback, useEffect, useState } from 'react';

/**
 * Fetches from the API client and tracks loading / error / refetch.
 *
 * Every backend route answers with a `{ success, data }` envelope in both of
 * its branches — real Mongo query or mock-mode fixture — so callers here get
 * the same shape whether or not a database is attached. That is what lets the
 * dashboards run in the no-DB demo.
 *
 * A failed request is not treated as fatal: `data` keeps its fallback so a
 * panel renders empty rather than collapsing the whole page.
 */
export function useApiData<T>(
  fetcher: () => Promise<{ success: boolean; data: T }>,
  fallback: T,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The fetcher is a fresh closure each render, so it cannot be a dependency
  // without looping. Callers pass `deps` for anything that should re-trigger.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      if (res?.success) setData(res.data ?? fallback);
      else setError('Request failed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { void load(); }, [load]);

  return { data, loading, error, refetch: load };
}

/**
 * Widen a literal fallback back to its base type.
 *
 * Without this, `field(row, 'status', '')` infers T as the literal type `""`,
 * and every later `=== 'pending'` comparison becomes a type error because the
 * two literals have no overlap. Primitives widen; object and array fallbacks
 * pass through untouched.
 */
type Widen<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T;

/** Read an unknown record from the API without pulling in a schema layer. */
export function field<T>(row: unknown, key: string, fallback: T): Widen<T> {
  const v = (row as Record<string, unknown> | null)?.[key];
  return (v === undefined || v === null ? fallback : v) as Widen<T>;
}
