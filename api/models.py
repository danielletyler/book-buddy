from sqlalchemy import Boolean, Float, Column, ForeignKey, Integer, String, Date, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from database import Base

class Book(Base):
  __tablename__ = 'books'

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, index=True)
  cover_url = Column(String, index=True)
  authors = Column(ARRAY(String), index=True)
  genres = Column(ARRAY(String), index=True)
  topics = Column(ARRAY(String), index=True)
  published_year = Column(Integer, index=True)

  rating = relationship("Rating", back_populates="book")

class Rating(Base):
  __tablename__ = 'ratings'

  id = Column(Integer, primary_key=True, index=True)
  book_id = Column(Integer, ForeignKey("books.id"))
  rating = Column(Integer, index=True)
  rating_scale = Column(Integer, index=True)
  notes = Column(String, index=True)
  rated_at = Column(Date, index=True)

  book = relationship("Book", back_populates="rating")
