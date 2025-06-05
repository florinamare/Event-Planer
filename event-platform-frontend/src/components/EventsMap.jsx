import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ForceMapResize = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
};

const EventsMap = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:3000/api/events");
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <MapContainer center={[45.9432, 24.9668]} zoom={6} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ForceMapResize />

      {events
        .filter(e => e.location?.coordinates?.length === 2)
        .map((event) => (
          <Marker
            key={event._id}
            position={[
              event.location.coordinates[1], // lat
              event.location.coordinates[0], // lon
            ]}
          >
            <Popup>
              <div className="p-3 rounded-xl shadow-lg bg-white w-60">
              <img
                  src={
                    event.image?.startsWith("http")
                      ? event.image
                      : `http://localhost:3000${event.image}`
                  }
                  alt={event.title}
                  onError={(e) => (e.target.src = "/default-event.png")}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />

                <h3 className="text-lg font-semibold text-[#000000]">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <Link
                  to={`/events/${event._id}`}
                  className="inline-block px-3 py-1 bg-[#C89459] text-white text-sm rounded hover:bg-[#A87C45] transition"
                >
                  Vezi Detalii
                </Link>
              </div>
            </Popup>


          </Marker>
        ))}
    </MapContainer>
  );
};

export default EventsMap;
