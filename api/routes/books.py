from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from database import get_db
from schemas import BookBase, BookRead
import models

router = APIRouter()

db_dependency = Annotated[Session, Depends(get_db)]

# get all books
@router.get("/books", tags=["Books"], response_model=List[BookRead])
async def list_all_books(db: db_dependency):
    result = db.query(models.Book).all()
    if not result:
        raise HTTPException(status_code=404, detail='Books not found')
    return result


# get a book
@router.get("/books/{book_id}", tags=["Books"], response_model=BookRead)
async def get_book(book_id: int, db: db_dependency):
    result = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not result:
        raise HTTPException(status_code=404, detail='Book is not found')
    return result

# create a book
@router.post("/books", tags=["Books"], response_model=BookRead)
async def create_books(book: BookBase, db: db_dependency):
    db_book = models.Book(api_id=book.api_id, title=book.title, authors=book.authors, cover_url=book.cover_url, genres=book.genres, topics=book.topics, published_year=book.published_year)
    db.add(db_book)
    db.commit()
    return db_book

# delete a book
@router.delete("/books/{book_id}", tags=["Books"])
async def delete_book(book_id: int, db: db_dependency):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(book)
    db.commit()
    return
