import { Book } from "./book";

export type Rating = {
  id: number;
  book_id: string;
  rating: number;
  rating_scale: number;
  notes: string;
  rated_at: string;
  book: Book;
};

export type RatingRead = {
  id: number;
  rating: number;
  rating_scale: number;
  notes: string;
  rated_at: string;
  book: Book;
};
