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
      <h1 className="text-2xl font-semibold mb-10 text-center text-gray-900">
        Book Insights
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Top Authors */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
            Top Authors
          </h2>
          <ul className="space-y-3 min-h-[150px]">
            {topAuthors?.length ? (
              topAuthors.map(({ author, avg_rating }) => (
                <li
                  key={author}
                  className="text-gray-800 cursor-default transition"
                  title={`Average rating: ${avg_rating.toFixed(2)}`}
                >
                  <span className="font-medium">{author}</span>:{" "}
                  <span>{avg_rating.toFixed(2)}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 italic">Loading...</p>
            )}
          </ul>
        </section>

        {/* Most Read Authors */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
            Most Read Authors
          </h2>
          <ul className="space-y-3 min-h-[150px]">
            {mostReadAuthors?.length ? (
              mostReadAuthors.map(({ author, num_ratings }) => (
                <li
                  key={author}
                  className="text-gray-800 cursor-default transition"
                  title={`Number of ratings: ${num_ratings}`}
                >
                  <span className="font-medium">{author}</span>:{" "}
                  <span>{num_ratings}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 italic">Loading...</p>
            )}
          </ul>
        </section>

        {/* Top Genres */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
            Top Genres
          </h2>
          <ul className="space-y-3 min-h-[150px]">
            {topGenres?.length ? (
              topGenres.map(({ genre, avg_rating }) => (
                <li
                  key={genre}
                  className="text-gray-800 cursor-default transition"
                  title={`Average rating: ${avg_rating.toFixed(2)}`}
                >
                  <span className="font-medium">{genre}</span>:{" "}
                  <span>{avg_rating.toFixed(2)}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 italic">Loading...</p>
            )}
          </ul>
        </section>

        {/* Most Read Genres */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
            Most Read Genres
          </h2>
          <ul className="space-y-3 min-h-[150px]">
            {mostReadGenres?.length ? (
              mostReadGenres.map(({ genre, num_ratings }) => (
                <li
                  key={genre}
                  className="text-gray-800 cursor-default transition"
                  title={`Number of ratings: ${num_ratings}`}
                >
                  <span className="font-medium">{genre}</span>:{" "}
                  <span>{num_ratings}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 italic">Loading...</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Insights;
