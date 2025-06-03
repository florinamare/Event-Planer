import EventSection from "../components/EventSection";
import { useEffect, useState } from "react";
import axios from "axios";
import HomeBanner from "../components/HomeBanner";

const Home = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [soonEvents, setSoonEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/events/recent").then((res) => {
      console.log("📦 Evenimente recente:", res.data);
      setRecentEvents(res.data);
    });

    axios.get("http://localhost:3000/api/events/soon").then((res) => {
      console.log("📦 Evenimente populare:", res.data);
      setPopularEvents(res.data);
    });

    axios.get("http://localhost:3000/api/events/popular").then((res) => {
      console.log("📦 Evenimente în curând:", res.data);
      setSoonEvents(res.data);
    });
  }, []);
  

  return (
    <div className="mt-0">
      <HomeBanner />
  
      <div className="mt-8">
        <EventSection title="Nou adăugate" events={recentEvents} />
        <EventSection title="În curând" events={soonEvents} />
        <EventSection title="Cele mai populare" events={popularEvents} />
      </div>
    </div>
  );
  
};

export default Home;
