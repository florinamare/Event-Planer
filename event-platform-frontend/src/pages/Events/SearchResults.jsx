// ✅ SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EventCard from "../../components/EventCard"; // adaptat în funcție de locația fișierului tău

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/search?q=${encodeURIComponent(searchQuery)}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Eroare la căutarea evenimentelor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <h2>Rezultate pentru: "{searchQuery}"</h2>
      {loading ? (
        <p>Se încarcă...</p>
      ) : results.length > 0 ? (
        <div className="event-grid">
          {results.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p>Nu am găsit evenimente care să corespundă căutării.</p>
      )}
    </div>
  );
}

export default SearchResults;
