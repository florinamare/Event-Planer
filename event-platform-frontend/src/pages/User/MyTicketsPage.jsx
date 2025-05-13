import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function MyTicketsPage() {
  const { user } = useContext(AuthContext);
  const [activeTickets, setActiveTickets] = useState([]);
  const [expiredTickets, setExpiredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setActiveTickets(data.active || []);
          setExpiredTickets(data.expired || []);
        } else {
          console.error("Eroare:", data.message);
        }
      } catch (err) {
        console.error("Eroare server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele...</p>;

  const renderTickets = (tickets) =>
    tickets.length > 0 ? (
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <strong>{ticket.event?.title}</strong> – {ticket.quantity} buc – {ticket.price} EUR
          </li>
        ))}
      </ul>
    ) : (
      <p>Nu există bilete în această categorie.</p>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Biletele Mele</h2>

      <section style={{ marginTop: "2rem" }}>
        <h3>🎟️ Bilete Actuale</h3>
        {renderTickets(activeTickets)}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>📁 Bilete Expirate</h3>
        {renderTickets(expiredTickets)}
      </section>
    </div>
  );
}

export default MyTicketsPage;
