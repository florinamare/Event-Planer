import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../../components/EventCard";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => {
        const filtered = selectedType
          ? data.filter((ev) => ev.type === selectedType)
          : data;

        setEvents(filtered);
        groupByCategory(filtered);
      })
      .catch((err) => console.error("❌ Eroare la încărcarea evenimentelor:", err))
      .finally(() => setLoading(false));
  }, [selectedType]);

  const groupByCategory = (eventList) => {
    const grouped = {};
    eventList.forEach((event) => {
      const category = event.type || "Fără categorie";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(event);
    });
    setGroupedEvents(grouped);
  };

  const formatType = (type) =>
    type
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="w-full px-6 py-10 bg-[#F9FAFB] min-h-screen">
      <h2 className="text-2xl font-bold text-[#26415E] mb-6">
        {selectedType
          ? `Evenimente din categoria: ${formatType(selectedType)}`
          : "Toate Evenimentele"}
      </h2>

      {loading ? (
        <p className="text-gray-500 text-base">Se încarcă evenimentele...</p>
      ) : Object.keys(groupedEvents).length === 0 ? (
        <p className="text-red-500 text-base">Nu există evenimente disponibile.</p>
      ) : (
        Object.entries(groupedEvents).map(([category, events]) => (
          <div key={category} className="mb-10">
            {!selectedType && (
              <h3 className="text-lg font-semibold text-[#2A9D8F] mb-4 capitalize">
                {formatType(category)}
              </h3>
            )}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-4"
              >
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

          </div>
        ))
      )}
    </div>
  );
}

export default EventsList;
