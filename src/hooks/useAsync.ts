import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(() => {
    setLoading(true);
    setError(null);
    asyncFn()
      .then((result) => {
        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, reload: execute };
}
