import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useGetRating } from "@/hooks/useGetRating";
import { useUpsertRating } from "@/hooks/useUpsertRating";

interface RateModalProps {
  book?: {
    id: string;
    volumeInfo: {
      title: string;
      description: string;
      authors?: string[];
      categories?: string[];
      imageLinks: {
        smallThumbnail: string;
      };
      publishedDate: string;
    };
  };
  show: boolean;
  onClose: () => void;
}

export const RateModal: React.FC<RateModalProps> = ({ book, onClose }) => {
  const { data: fetchedRating } = useGetRating(book?.id);
  const { upsertRating, data: upsertedRating } = useUpsertRating(book?.id);

  const [rating, setRating] = useState(0);

  const [ratingToDisplay, setRatingToDisplay] = useState(
    upsertedRating || fetchedRating
  );

  console.log(ratingToDisplay);

  // Initialize rating when fetched rating loads
  useEffect(() => {
    if (fetchedRating) {
      setRating(fetchedRating.rating);
      setRatingToDisplay(fetchedRating);
    }
  }, [fetchedRating]);

  // Update rating when a new rating is upserted
  useEffect(() => {
    if (upsertedRating) {
      setRating(upsertedRating.rating);
      setRatingToDisplay(upsertedRating);
    }
  }, [upsertedRating]);

  useEffect(() => {
    setRating(0);
    setRatingToDisplay(null);
  }, [book]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!book) return; // guard against undefined

    const payload = {
      book: {
        api_id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors ?? [],
        genres: book.volumeInfo.categories, // add empty arrays if required
        topics: [],
        cover_url: book.volumeInfo.imageLinks?.smallThumbnail ?? "",
        published_year: book.volumeInfo.publishedDate
          ? parseInt(book.volumeInfo.publishedDate.slice(0, 4))
          : 0,
      },
      rating: {
        rating,
        rating_scale: 5,
        notes: "",
        rated_at: new Date().toISOString().slice(0, 10),
      },
    };

    try {
      await upsertRating(payload);
      // maybe set submitted state here or show a message
    } catch (error) {
      console.error("Failed to submit rating:", error);
      // handle error UI here
    }
  }

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

          <h2 className="mb-4 text-xl font-bold">{book.volumeInfo.title}</h2>

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

          {ratingToDisplay && (
            <p className="mb-4 text-sm text-green-600">
              You rated this {ratingToDisplay.rating} / 5 on{" "}
              {ratingToDisplay.rated_at}.
            </p>
          )}

          {/* Book details */}
          <section className="space-y-3 text-sm">
            <div className="mb-4 flex justify-start">
              <div>
                <Image
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt={`${book.volumeInfo.title} cover`}
                  width={128} // adjust as needed
                  height={192}
                  className="rounded shadow"
                  unoptimized // remove if you configure remotePatterns in next.config.js
                />
              </div>
            </div>
            <div>
              <p className="font-bold">Authors</p>
              {book.volumeInfo.authors?.map((a, i) => <p key={i}>{a}</p>) || (
                <p>Unknown author</p>
              )}
            </div>

            <div>
              <p className="font-bold">Categories</p>
              {book.volumeInfo.categories?.map((c, i) => (
                <p key={i}>{c}</p>
              ))}
            </div>

            <div>
              <p className="font-bold">Description</p>
              <p>{book.volumeInfo.description}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
