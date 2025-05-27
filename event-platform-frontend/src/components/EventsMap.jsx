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
              <div>
                <strong>{event.title}</strong><br />
                <p>{event.location?.address}</p>
                <Link
                  to={`/events/${event._id}`}
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#0056b3",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px"
                  }}
                >
                  Vezi detalii
                </Link>

              </div>
            </Popup>

          </Marker>
        ))}
    </MapContainer>
  );
};

export default EventsMap;
