import { useState } from "react";

// Pydantic models:
// interface BookInfo { api_id: string; title?: string; authors?: string[]; genres?: string[]; topics?: string[]; cover_url?: string; published_year?: number; }
// interface RatingBase { rating: number; rating_scale: number; notes: string; rated_at: string; }

// Combine both into one payload
export interface UpsertRatingPayload {
  book: {
    api_id: string;
    title?: string;
    authors?: string[];
    genres?: string[];
    topics?: string[];
    cover_url?: string;
    published_year?: number;
  };
  rating: {
    rating: number;
    rating_scale: number;
    notes: string;
    rated_at: string; // ISO date string
  };
}

export interface RatingRead {
  id: number;
  book_id: string;
  rating: number;
  rating_scale: number;
  notes: string;
  rated_at: string;
}

export function useUpsertRating(bookId: string) {
  const [data, setData] = useState<RatingRead | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /** Call this with combined book + rating data */
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

      const json: RatingRead = await res.json();
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
