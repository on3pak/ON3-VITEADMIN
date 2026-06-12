import { useCallback, useEffect, useState } from 'react';
import { lookupsApi } from '../api/services/lookups';
import type { AllLookups } from '../api/services/lookups';

const cache = new Map<string, { data: AllLookups; expires: number }>();
const TTL = 60_000;

export function useLookups() {
  const [lookups, setLookups] = useState<AllLookups | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const cached = cache.get('all');
    if (cached && cached.expires > Date.now()) {
      setLookups(cached.data);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await lookupsApi.getAll();
      cache.set('all', { data, expires: Date.now() + TTL });
      setLookups(data);
    } catch {
      setLookups(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { lookups, loading, refresh: load };
}
