import { Book } from "./book";

export type Rating = {
  id: number;
  book_id: string;
  rating: number;
  rating_scale: number;
  notes: string;
  rated_at: Date;
  book: Book;
};
