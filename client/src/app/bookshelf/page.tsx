"use client";
import Image from "next/image";
import { useGetRatings } from "@/hooks/useGetRatings";
import React, { useState } from "react";
import { RateModal } from "@/components/RateModal";

const Bookshelf = () => {
  const { data } = useGetRatings();
  const [selectedBook, setSelectedBook] = useState(undefined);

  if (!data?.length) return <p className="text-center mt-8">No ratings yet.</p>;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Bookshelf</h1>

      {/* Responsive grid: 1‑col on mobile, 2‑col on md, 3‑col on lg */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((rating) => (
          <li
            key={rating.id}
            className="rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => setSelectedBook(rating.book)}
          >
            <div className="relative h-48 w-full">
              {rating.book.cover_url ? (
                <Image
                  src={rating.book.cover_url}
                  alt={`${rating.book.title} cover`}
                  fill
                  className="object-cover"
                  unoptimized // remove if you configure remotePatterns in next.config.js
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                  No cover
                </div>
              )}
            </div>

            <div className="p-4 space-y-1">
              <h2 className="font-medium">{rating.book.title}</h2>

              <p className="text-sm text-gray-600">
                {rating.book.authors?.join(", ") || "Unknown author"}
              </p>

              <p className="text-xs text-gray-500">
                {rating.book.genres?.join(", ") || "Uncategorized"} •{" "}
                {rating.book.publish_year || "N/A"}
              </p>

              <p className="mt-2 font-semibold">
                {rating.rating} / 5
                <span className="ml-1 text-xs font-normal text-gray-500">
                  ({new Date(rating.rated_at).toLocaleDateString()})
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <RateModal
        book={selectedBook}
        onClose={() => setSelectedBook(undefined)}
      />
    </section>
  );
};

export default Bookshelf;
