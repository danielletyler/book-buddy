import { AuthorAvg } from "@/types";
import { useEffect, useState } from "react";

export function useGetTopAuthors() {
  const [data, setData] = useState<AuthorAvg[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTopAuthors() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/insights/top-authors`);
        if (!res.ok) {
          throw new Error("Failed to fetch insight");
        }
        const json: [] = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTopAuthors();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
