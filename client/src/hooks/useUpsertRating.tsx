import { Rating } from "@/types";
import { useState } from "react";
export interface UpsertRatingPayload {
  book: {
    api_id: string;
    title?: string;
    authors?: string[];
    genres?: string[];
    description: string;
    cover_url?: string;
    published_year?: number;
  };
  rating: {
    rating: number;
    rating_scale: number;
    notes: string;
    rated_at: string;
  };
}

export function useUpsertRating(bookId?: string) {
  const [data, setData] = useState<Rating | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const upsertRating = async (payload: UpsertRatingPayload) => {
    console.log(payload);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/books/${bookId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to upsert rating: ${res.status}`);
      }

      const json: Rating = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { upsertRating, data, loading, error };
}
