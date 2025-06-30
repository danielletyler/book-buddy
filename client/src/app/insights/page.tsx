"use client";

import { useGetMostReadAuthors } from "@/hooks/useGetMostReadAuthors";
import { useGetMostReadGenres } from "@/hooks/useGetMostReadGenres";
import { useGetTopAuthors } from "@/hooks/useGetTopAuthors";
import { useGetTopGenres } from "@/hooks/useGetTopGenres";
import React from "react";

const Insights = () => {
  const { data: mostReadAuthors } = useGetMostReadAuthors();
  const { data: mostReadGenres } = useGetMostReadGenres();
  const { data: topAuthors } = useGetTopAuthors();
  const { data: topGenres } = useGetTopGenres();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Insights</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Top Authors */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Top Authors</h2>
          <ul className="list-disc list-inside space-y-2 min-h-[150px]">
            {topAuthors?.length ? (
              topAuthors.map(({ author, avg_rating }) => (
                <li key={author} className="text-gray-700">
                  <span className="font-medium">{author}</span>:{" "}
                  {avg_rating.toFixed(2)}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </ul>
        </section>

        {/* Most Read Authors */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Most Read Authors</h2>
          <ul className="list-disc list-inside space-y-2 min-h-[150px]">
            {mostReadAuthors?.length ? (
              mostReadAuthors.map(({ author, num_ratings }) => (
                <li key={author} className="text-gray-700">
                  <span className="font-medium">{author}</span>: {num_ratings}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </ul>
        </section>

        {/* Top Genres */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Top Genres</h2>
          <ul className="list-disc list-inside space-y-2 min-h-[150px]">
            {topGenres?.length ? (
              topGenres.map(({ genre, avg_rating }) => (
                <li key={genre} className="text-gray-700">
                  <span className="font-medium">{genre}</span>:{" "}
                  {avg_rating.toFixed(2)}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </ul>
        </section>

        {/* Most Read Genres */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Most Read Genres</h2>
          <ul className="list-disc list-inside space-y-2 min-h-[150px]">
            {mostReadGenres?.length ? (
              mostReadGenres.map(({ genre, num_ratings }) => (
                <li key={genre} className="text-gray-700">
                  <span className="font-medium">{genre}</span>: {num_ratings}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Insights;
