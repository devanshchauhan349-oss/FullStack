import React, { useState } from "react";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [books, setBooks] = useState([
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Pride and Prejudice", author: "Jane Austen" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const addBook = (book) => {
    // Prevent duplicates (same title + author)
    const exists = books.some(
      (b) =>
        b.title.toLowerCase() === book.title.toLowerCase() &&
        b.author.toLowerCase() === book.author.toLowerCase()
    );
    if (!exists) {
      setBooks([...books, book]);
    } else {
      alert("This book already exists!");
    }
  };

  const removeBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>📚 Library Management System</h1>
      <SearchBar setSearchTerm={setSearchTerm} />
      <BookForm addBook={addBook} />
      <BookList books={filteredBooks} removeBook={removeBook} />
    </div>
  );
}

export default App;