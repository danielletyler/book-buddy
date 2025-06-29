"use client";
import { useGetRatings } from "@/hooks/useGetRatings";
import React from "react";

const Bookshelf = () => {
  const { data } = useGetRatings();

  console.log(data);

  return (
    <div>
      Bookshelf
      {data?.map((rating) => (
        <div key={rating.id}>{rating.book_id}</div>
      ))}
      <div>books</div>
    </div>
  );
};

export default Bookshelf;
