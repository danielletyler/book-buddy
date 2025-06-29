// hooks/useCreateBook.ts
import { useState } from "react";

/* ---------- payload the endpoint expects ---------- */
export interface BookInput {
  api_id: string; // external ID (e.g., Google volumeId)
  title: string;
  authors: string[];
  cover_url: string;
  published_year: number;
}

/* ---------- what the server returns ---------- */
export interface BookRead extends BookInput {
  id: number; // DB primary key
}

export function useCreateBook() {
  const [data, setData] = useState<BookRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /** Call this to ensure the book exists (creates or returns existing row). */
  const createBook = async (payload: BookInput): Promise<BookRead> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/books", {
        method: "POST", // idempotent upsert
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Book upsert failed: ${res.status}`);
      }

      const json: BookRead = await res.json();
      setData(json);
      return json; // let callers await
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBook, data, loading, error };
}
