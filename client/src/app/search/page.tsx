"use client";

import React, { useState } from "react";
import { useBookSearch } from "@/hooks/useBookSearch";
import { RateModal } from "../../components/RateModal";
import { Book } from "@/types";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [query, setQuery] = useState("");
  const { data: books = [], loading, error } = useBookSearch(query);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
        Search Books
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex space-x-3 mb-6"
        aria-label="Search books"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type title or author"
          className="flex-grow border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-600">Loading…</p>}
      {error && (
        <p className="text-red-600 font-medium">Error: {error.message}</p>
      )}

      <div className="space-y-3">
        {books.length === 0 && query && !loading && (
          <p className="text-gray-500 italic">No results found.</p>
        )}
        {books.map((b: Book) => (
          <div
            key={b.api_id}
            onClick={() => setSelectedBook(b)}
            className="cursor-pointer p-4 border border-gray-200 rounded-md hover:shadow-lg transition-shadow bg-white"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedBook(b)}
          >
            <h2 className="font-semibold text-lg text-gray-900">{b.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {b.authors?.join(", ") ?? "Unknown author"}
            </p>
          </div>
        ))}
      </div>

      <RateModal
        book={selectedBook}
        onClose={() => setSelectedBook(undefined)}
      />
    </div>
  );
};

export default Search;
