import { useEffect, useState } from "react";

export function useGetRating(bookId?: string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return; // guard for empty input
    let cancelled = false; // prevents state updates after unmount

    async function fetchRatings() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/books/${bookId}/rating`);
        // const res = await fetch(`http://localhost:8000/books/abcdef/rating`);
        console.log(res);
        if (!res.ok) {
          throw new Error("Failed to fetch ratings");
        }
        const json: [] = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRatings();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  return { data, loading, error };
}
