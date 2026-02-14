import React from "react";

function SearchBar({ setSearchTerm }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;