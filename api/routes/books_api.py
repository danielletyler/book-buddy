from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Annotated, List
from sqlalchemy.orm import Session
from database import get_db
from schemas import BookBase, BookRead
import models
import httpx

GOOGLE_BOOKS_API_KEY = "AIzaSyD9mj9Lu1VyXH9Z20kSvDOwo488kIkhhig"
router = APIRouter()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/books_api/search", tags=["Books-API"])
async def search_google_books(q: str, max_results: int = 10):
    params = {"q": q, "maxResults": max_results, "key": GOOGLE_BOOKS_API_KEY}
    async with httpx.AsyncClient() as client:
        r = await client.get("https://www.googleapis.com/books/v1/volumes", params=params)
    r.raise_for_status()

    raw_items = r.json().get("items", [])
    results: list[BookBase] = []

    for item in raw_items:
        info = item.get("volumeInfo", {})

        published_date = info.get("publishedDate")

        cover_url = None
        image_links = info.get("imageLinks", {})
        # Prefer smallThumbnail if available, fallback to thumbnail
        if image_links.get("smallThumbnail"):
            cover_url = image_links.get("smallThumbnail")
        elif image_links.get("thumbnail"):
            cover_url = image_links.get("thumbnail")

        results.append(
            BookBase(
                api_id=item.get("id"),
                title=info.get("title") or "Untitled",
                description=info.get("description") or "Untitled",
                authors=info.get("authors") or [],
                genres=info.get("categories") or [],
                published_year=int(published_date[:4]),
                cover_url=cover_url,
            )
        )

    return results
