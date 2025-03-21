import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div>
      

      {/* HERO SECTION */}
      <header className="hero">
        <h1>Descoperă Evenimente Unice</h1>
      </header>

      {/* LISTA EVENIMENTELOR */}
      <section className="event-container">
        <div className="event-card">
          <img src="/event1.jpg" alt="Event" />
          <h3>Concert Rock</h3>
          <p>📍 București | 🗓 22 Martie 2025</p>
          <button>Vezi Detalii</button>
        </div>
        <div className="event-card">
          <img src="/event2.jpg" alt="Event" />
          <h3>Festival Electronic</h3>
          <p>📍 Cluj-Napoca | 🗓 15 Aprilie 2025</p>
          <button>Vezi Detalii</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
