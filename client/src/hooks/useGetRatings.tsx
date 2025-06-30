import { Rating } from "@/types";
import { useEffect, useState } from "react";

export function useGetRatings() {
  const [data, setData] = useState<Rating[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRatings() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/ratings`);
        if (!res.ok) {
          throw new Error("Failed to fetch ratings");
        }
        const json: Rating[] = await res.json();
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
  }, []);

  return { data, loading, error };
}
