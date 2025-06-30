# api/routers/insights.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, desc, select
from sqlalchemy.orm import Session
from typing import Annotated, List
from database import get_db
from schemas import GenreAvg, GenreCount, AuthorAvg, AuthorCount
import models

router = APIRouter(prefix="/insights", tags=["Insights"])

db = Annotated[Session, Depends(get_db)]

# ──────────────────────────────
# Helper builders
# ──────────────────────────────

def _genre_avg_stmt(limit: int):
    genre = func.unnest(models.Book.genres).label("genre")
    return (
        select(
            genre,
            func.avg(models.Rating.rating).label("avg_rating"),
        )
        .select_from(models.Rating)                       # ← start from Rating
        .join(models.Book, models.Rating.book_id == models.Book.api_id)
        .group_by(genre)
        .order_by(desc("avg_rating"))
        .limit(limit)
    )


def _author_avg_stmt(limit: int):
    author = func.unnest(models.Book.authors).label("author")
    return (
        select(
            author,
            func.avg(models.Rating.rating).label("avg_rating"),
        )
        .select_from(models.Rating)
        .join(models.Book, models.Rating.book_id == models.Book.api_id)
        .group_by(author)
        .order_by(desc("avg_rating"))
        .limit(limit)
    )


def _genre_count_stmt(limit: int):
    genre = func.unnest(models.Book.genres).label("genre")
    return (
        select(
            genre,
            func.count().label("num_ratings"),
        )
        .select_from(models.Rating)
        .join(models.Book, models.Rating.book_id == models.Book.api_id)
        .group_by(genre)
        .order_by(desc("num_ratings"))
        .limit(limit)
    )


def _author_count_stmt(limit: int):
    author = func.unnest(models.Book.authors).label("author")
    return (
        select(
            author,
            func.count().label("num_ratings"),
        )
        .select_from(models.Rating)
        .join(models.Book, models.Rating.book_id == models.Book.api_id)
        .group_by(author)
        .order_by(desc("num_ratings"))
        .limit(limit)
    )

# ──────────────────────────────
# Endpoints
# ──────────────────────────────

@router.get(
    "/top-genres",
    response_model=List[GenreAvg],
    summary="Highest‑rated genres",
)
def top_genres(limit: int = 10, db: Session = Depends(get_db)):
    rows = db.execute(_genre_avg_stmt(limit)).all()
    if not rows:
        raise HTTPException(404, "No ratings yet")
    return [{"genre": g, "avg_rating": float(a)} for g, a in rows]


@router.get(
    "/top-authors",
    response_model=List[AuthorAvg],
    summary="Highest‑rated authors",
)
def top_authors(limit: int = 10, db: Session = Depends(get_db)):
    rows = db.execute(_author_avg_stmt(limit)).all()
    if not rows:
        raise HTTPException(404, "No ratings yet")
    return [{"author": a, "avg_rating": float(r)} for a, r in rows]


@router.get(
    "/most-read-genres",
    response_model=List[GenreCount],
    summary="Most‑read genres (by # ratings)",
)
def most_read_genres(limit: int = 10, db: Session = Depends(get_db)):
    rows = db.execute(_genre_count_stmt(limit)).all()
    if not rows:
        raise HTTPException(404, "No ratings yet")
    return [{"genre": g, "num_ratings": int(c)} for g, c in rows]


@router.get(
    "/most-read-authors",
    response_model=List[AuthorCount],
    summary="Most‑read authors (by # ratings)",
)
def most_read_authors(limit: int = 10, db: Session = Depends(get_db)):
    rows = db.execute(_author_count_stmt(limit)).all()
    if not rows:
        raise HTTPException(404, "No ratings yet")
    return [{"author": a, "num_ratings": int(c)} for a, c in rows]
