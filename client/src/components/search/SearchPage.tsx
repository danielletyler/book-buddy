import React, { useState } from "react";
import { useBookSearch } from "@/hooks/useBookSearch";
import { RateModal } from "../rate/RateModal";

export const SearchPage = () => {
  const [inputValue, setInputValue] = useState(""); // controlled input field
  const [selectedBook, setSelectedBook] = useState(undefined);
  const [query, setQuery] = useState(""); // triggers search
  const { data: books, loading, error } = useBookSearch(query);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue); // only search on submit
  }

  const handleClick = (b) => {
    setSelectedBook(b);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Search Books</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type title or author"
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading…</p>}
      {error && <p className="mt-4 text-red-600">Error: {error.message}</p>}

      <div className="mt-4 space-y-1">
        {books.map((b) => (
          <div
            key={b.id}
            onClick={() => handleClick(b)}
            className="hover:cursor-pointer hover:underline"
          >
            <strong>{b.volumeInfo.title}</strong>
            {" — "}
            {b.volumeInfo.authors?.join(", ") ?? "Unknown author"}
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
