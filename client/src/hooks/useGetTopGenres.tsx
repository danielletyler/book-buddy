// src/hooks/useBookSearch.ts
import { GenreAvg } from "@/types";
import { useEffect, useState } from "react";

export function useGetTopGenres() {
  const [data, setData] = useState<GenreAvg[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTopGenres() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/insights/top-genres`);
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

    fetchTopGenres();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
