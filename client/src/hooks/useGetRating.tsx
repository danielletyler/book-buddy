import { Rating } from "@/types";
import { useEffect, useState } from "react";

export function useGetRating(bookId?: string): {
  data?: Rating;
  loading: boolean;
  error?: Error;
} {
  const [data, setData] = useState<Rating | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;

    async function fetchRatings() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/books/${bookId}/rating`);
        if (!res.ok) {
          throw new Error("Failed to fetch ratings");
        }
        const json: Rating = await res.json();
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
