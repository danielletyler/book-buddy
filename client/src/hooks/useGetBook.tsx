// src/hooks/useBookSearch.ts
import { useEffect, useState } from "react";

export function useBookSearch(bookId: Int32Array) {
  const [data, setData] = useState<[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return; // guard for empty input
    let cancelled = false; // prevents state updates after unmount

    async function fetchBook() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/books/${bookId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        const json: [] = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBook();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  return { data, loading, error };
}
