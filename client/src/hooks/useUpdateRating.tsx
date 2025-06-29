import { useState } from "react";

// Describe the payload your API expects
export interface RatingInput {
  book_id: string;
  rating: number;
  rating_scale: number;
  notes: string;
  rated_at: string; // ISO date string, e.g. new Date().toISOString()
}

// What the server sends back (adjust to your schema)
export interface RatingRead extends RatingInput {
  id: number;
}

export function useUpdateRating() {
  const [data, setData] = useState<RatingRead | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /** Call this when the user submits the form */
  const updateRating = async (rating_id: Int16Array, payload: RatingInput) => {
    console.log(rating_id);
    setLoading(true);
    setError(null);
    console.log(payload);
    try {
      const res = await fetch(`http://localhost:8000/ratings/${rating_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to update rating: ${res.status}`);
      }

      const json: RatingRead = await res.json();
      setData(json);
      return json; // optional: so callers can await
    } catch (err) {
      setError(err as Error);
      throw err; // surface to caller if needed
    } finally {
      setLoading(false);
    }
  };

  return { updateRating, data, loading, error };
}
