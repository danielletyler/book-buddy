from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from database import get_db
from schemas import RatingBase, RatingRead, RatingUpdate, RatingWithBook
import models

router = APIRouter()

db_dependency = Annotated[Session, Depends(get_db)]

# get rating on book
@router.get("/books/{book_id}/rating", tags=["Ratings"], response_model=RatingRead)
async def rating_for_book(book_id: str, db: db_dependency):
    result = db.query(models.Rating).filter(models.Rating.book_id == book_id).first()
    if not result:
        raise HTTPException(status_code=404, detail='Rating is not found')
    return result

# get all ratings
@router.get("/ratings", tags=["Ratings"], response_model=List[RatingRead])
async def list_all_ratings(db: db_dependency):
    result = db.query(models.Rating).all()
    if not result:
        raise HTTPException(status_code=404, detail='Ratings not found')
    return result


# get a rating
@router.get("/ratings/{rating_id}", tags=["Ratings"], response_model=RatingRead)
async def get_rating(rating_id: int, db: db_dependency):
    result = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
    if not result:
        raise HTTPException(status_code=404, detail='Rating is not found')
    return result

# create rating
@router.post("/ratings", tags=["Ratings"], response_model=RatingRead)
async def create_accounts(rating: RatingBase, db: db_dependency):
    db_rating = models.Rating(book_id=rating.book_id, rating=rating.rating, rating_scale=rating.rating_scale, notes=rating.notes, rated_at=rating.rated_at)
    db.add(db_rating)
    db.commit()
    return db_rating

# update a rating
@router.put("/ratings/{rating_id}", tags=["Ratings"], response_model=RatingRead)
async def update_rating(rating_id: int, rating_update: RatingUpdate, db: db_dependency):
    rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
    if not rating:
        raise HTTPException(status_code=404, detail='Rating not found')

    for attr, value in rating_update.dict(exclude_unset=True).items():
        setattr(rating, attr, value)

    db.commit()
    db.refresh(rating)

    return rating

# delete a rating
@router.delete("/rating/{rating_id}", tags=["Ratings"])
async def delete_rating(rating_id: int, db: db_dependency):
    rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")

    db.delete(rating)
    db.commit()
    return

@router.post("/books/{book_id}/rating", response_model=RatingRead)
async def upsert_rating(
    book_id: str,
    payload: RatingWithBook,
    db: Session = Depends(get_db),
):
    book_data = payload.book
    rating_data = payload.rating

    book = db.query(models.Book).filter(models.Book.api_id == book_id).first()
    if not book:
        book = models.Book(
            api_id=book_data.api_id,
            title=book_data.title or "Unknown",
            authors=book_data.authors or [],
            genres=book_data.genres or [],
            topics=book_data.topics or [],
            cover_url=book_data.cover_url or "",
            published_year=book_data.published_year or 0,
        )
        db.add(book)
        db.commit()
        db.refresh(book)

    rating = db.query(models.Rating).filter(models.Rating.book_id == book.api_id).first()
    if rating:
        rating.rating = rating_data.rating
        rating.rating_scale = rating_data.rating_scale
        rating.notes = rating_data.notes
        rating.rated_at = rating_data.rated_at
    else:
        rating = models.Rating(
            book_id=book.api_id,
            rating=rating_data.rating,
            rating_scale=rating_data.rating_scale,
            notes=rating_data.notes,
            rated_at=rating_data.rated_at,
        )
        db.add(rating)

    db.commit()
    db.refresh(rating)
    return rating
