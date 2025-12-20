import { useState, useEffect } from 'react';

interface UseFetchOptions {
  skip?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options.skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (options.skip) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.skip]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
