import React from "react";

function BookList({ books, removeBook }) {
  return (
    <ul>
      {books.map((book, index) => (
        <li key={index}>
          <span>{book.title} by {book.author}</span>
          <button className="remove" onClick={() => removeBook(index)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

export default BookList;