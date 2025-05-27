import EventsMap from "../../components/EventsMap";
import "../../styles/map.css"; // stil separat, vezi mai jos

const EventsMapPage = () => {
  return (
    <div className="map-wrapper">
      <h2 className="map-title">🗺️ Harta Evenimentelor</h2>
      <EventsMap />
    </div>
  );
};

export default EventsMapPage;
