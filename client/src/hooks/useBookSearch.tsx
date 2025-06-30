import { useEffect, useState } from "react";

export function useBookSearch(query: string) {
  const [data, setData] = useState<[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      try {
        const encoded = encodeURIComponent(query);
        const res = await fetch(
          `http://localhost:8000/books_api/search?q=${encoded}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }
        const json: [] = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading, error };
}
