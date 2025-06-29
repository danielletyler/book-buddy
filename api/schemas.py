from datetime import date
from typing import List
from pydantic import BaseModel

class BookBase(BaseModel):
    api_id: str
    title: str
    authors: list[str]
    genres: list[str]
    topics: list[str]
    cover_url: str
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
