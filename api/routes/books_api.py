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
    return r.json()
