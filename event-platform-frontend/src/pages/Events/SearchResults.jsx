import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EventCard from "../../components/EventCard";

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
    <div className="min-h-screen bg-[#E6E6E6] dark:bg-[#0B1B32] text-[#1D5C5F] dark:text-white px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-[#000000] dark:text-[#A8DADC]">
        Rezultate pentru: "<span className="italic">{searchQuery}</span>"
      </h2>

      {loading ? (
        <p className="text-lg">Se încarcă...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-red-600 dark:text-red-300">
          Nu am găsit evenimente care să corespundă căutării.
        </p>
      )}
    </div>
  );
}

export default SearchResults;
