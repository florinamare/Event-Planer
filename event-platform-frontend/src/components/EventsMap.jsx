import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

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
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:3000/api/events");
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const geocode = async (address) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  };

  useEffect(() => {
    const loadCoords = async () => {
      const newPins = [];
      for (const event of events) {
        if (event.location?.address) {
          const coords = await geocode(event.location.address);
          if (coords) newPins.push({ ...event, coords });
        }
      }
      setPins(newPins);
    };
    if (events.length > 0) loadCoords();
  }, [events]);

  return (
    <MapContainer center={[45.9432, 24.9668]} zoom={6} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ForceMapResize />
      {pins.map((event, idx) => (
        <Marker key={idx} position={[event.coords.lat, event.coords.lon]}>
          <Popup>
            <strong>{event.title}</strong>
            <br />
            {event.location?.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventsMap;
