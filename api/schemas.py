from datetime import date
from typing import List, Optional
from pydantic import BaseModel

class BookBase(BaseModel):
    api_id: str
    title: str
    authors: list[str]
    genres: list[str]
    description: str
    cover_url: Optional[str] = None
    published_year: int

class BookRead(BookBase):
    id: int

    class Config:
        orm_mode = True

class RatingBase(BaseModel):
    book_id: str
    rating: int
    rating_scale: int
    notes: str
    rated_at: date

class RatingUpsert(BaseModel):
    rating: int
    rating_scale: int
    notes: str
    rated_at: date

class RatingUpdate(BaseModel):
    rating: int
    rating_scale: int
    notes: str
    rated_at: date

class RatingRead(RatingBase):
    id: int
    book: BookBase

    class Config:
        orm_mode = True

class RatingWithBook(BaseModel):
    book: BookBase
    rating: RatingUpsert


class GenreAvg(BaseModel):
    genre: str
    avg_rating: float

class AuthorAvg(BaseModel):
    author: str
    avg_rating: float

class GenreCount(BaseModel):
    genre: str
    num_ratings: int

class AuthorCount(BaseModel):
    author: str
    num_ratings: int
