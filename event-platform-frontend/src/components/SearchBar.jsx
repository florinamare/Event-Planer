function SearchBar({ searchQuery, setSearchQuery }) {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Caută eveniment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    );
  }
  
  export default SearchBar;
  