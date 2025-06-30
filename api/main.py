from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routes import books, ratings, books_api, insights

app = FastAPI()

origins = [
    "http://localhost:3000",  # your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins (not recommended in production)
    allow_credentials=True,
    allow_methods=["*"],    # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],    # allow all headers
)

models.Base.metadata.create_all(bind=engine)

app.include_router(books.router)
app.include_router(ratings.router)
app.include_router(books_api.router)
app.include_router(insights.router)
