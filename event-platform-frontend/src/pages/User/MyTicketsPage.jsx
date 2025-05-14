import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function MyTicketsPage() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState({ active: [], expired: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setTickets(data);
        } else {
          console.error("Eroare la preluarea biletelor:", data.message);
        }
      } catch (err) {
        console.error("Eroare server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Biletele Mele</h2>

      {/* 🔵 Bilete actuale */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#0056b3" }}>🎫 Bilete Active</h3>
        {tickets.active.length === 0 ? (
          <p>Nu ai bilete pentru evenimente viitoare.</p>
        ) : (
          <ul>
            {tickets.active.map((ticket) => (
              <li key={ticket._id}>
                <strong>{ticket.event.title}</strong> – {ticket.quantity} x {ticket.ticketType} ({ticket.price} EUR)
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 🔴 Bilete expirate */}
      <section>
        <h3 style={{ color: "#888" }}>🕘 Bilete Expirate</h3>
        {tickets.expired.length === 0 ? (
          <p>Nu ai bilete expirate.</p>
        ) : (
          <ul>
            {tickets.expired.map((ticket) => (
              <li key={ticket._id}>
                <strong>{ticket.event.title}</strong> – {ticket.quantity} x {ticket.ticketType} ({ticket.price} EUR)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default MyTicketsPage;
