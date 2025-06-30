import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useGetRating } from "@/hooks/useGetRating";
import { useUpsertRating } from "@/hooks/useUpsertRating";
import { Book, Rating } from "@/types";
import { FaTrashAlt } from "react-icons/fa";
import { useDeleteRating } from "@/hooks/useDeleteRating";
interface RateModalProps {
  book?: Book;
  onClose: () => void;
  onDelete?: (deletedRating: number) => void;
  onUpdate?: (updateRating: Rating) => void;
}

export const RateModal: React.FC<RateModalProps> = ({
  book,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const { data: fetchedRating } = useGetRating(book?.api_id);
  const { upsertRating, data: upsertedRating } = useUpsertRating(book?.api_id);
  const { deleteRating } = useDeleteRating();

  const [rating, setRating] = useState(0);
  const [ratedAt, setRatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedRating) {
      setRating(fetchedRating.rating);
      setRatedAt(fetchedRating.rated_at);
    }
  }, [fetchedRating]);

  useEffect(() => {
    if (upsertedRating) {
      setRating(upsertedRating.rating);
      setRatedAt(upsertedRating.rated_at);
    }
  }, [upsertedRating]);

  useEffect(() => {
    setRating(0);
    setRatedAt(null);
  }, [book]);

  const handleDeleteRating = () => {
    const id = fetchedRating?.id;
    if (id) {
      deleteRating(fetchedRating.id);
      setRating(0);
      setRatedAt(null);
      onDelete?.(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book) return;

    const payload = {
      book: {
        ...book,
        published_year: Number(book.published_year),
      },
      rating: {
        rating,
        rating_scale: 5,
        notes: "",
        rated_at: new Date().toISOString().slice(0, 10),
      },
    };

    try {
      const res = await upsertRating(payload);
      onUpdate?.(res);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  if (!book) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Centering wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal panel */}
        <div
          className="relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="mb-4 text-xl font-bold">{book.title}</h2>

          {/* Rating form */}
          <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  className="text-3xl leading-none focus:outline-none"
                >
                  <span
                    className={
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Submit
            </button>
          </form>

          {ratedAt && (
            <div className="flex gap-4">
              <p className="mb-4 text-sm text-green-600">
                You rated this {rating} / 5 on {ratedAt}.
              </p>
              <FaTrashAlt
                onClick={handleDeleteRating}
                className="text-red-500 hover:text-red-700"
              />
            </div>
          )}

          {/* Book details */}
          <section className="space-y-3 text-sm">
            <div className="mb-4 flex justify-start">
              <div>
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={`${book.title} cover`}
                    width={128}
                    height={192}
                    className="rounded shadow"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    No cover
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="font-bold">Authors</p>
              {book.authors?.map((a, i) => <p key={i}>{a}</p>) || (
                <p>Unknown author</p>
              )}
            </div>

            <div>
              <p className="font-bold">Genres</p>
              {book.genres?.map((c, i) => (
                <p key={i}>{c}</p>
              ))}
            </div>

            <div>
              <p className="font-bold">Description</p>
              <p>{book.description}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
