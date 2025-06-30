import { useState } from "react";

export function useDeleteRating() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * @param ratingId – the numeric / string ID of the rating row
   */
  async function deleteRating(ratingId: number | string) {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`http://localhost:8000/ratings/${ratingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete rating");
      }

      if (!cancelled) setSuccess(true);
    } catch (err) {
      if (!cancelled) setError(err as Error);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }

  return { deleteRating, success, loading, error };
}
