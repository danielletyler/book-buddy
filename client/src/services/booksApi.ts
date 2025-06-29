export async function searchBooks(query: string): Promise<[]> {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `http://localhost:8000/books_api/search?q=${encodedQuery}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await response.json();
  return data; // assuming data is an array of books
}
