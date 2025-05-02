// src/pages/User/MyTicketsPage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function MyTicketsPage() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTickets(data);
        else console.error("Eroare la preluarea biletelor:", data.message);
      } catch (err) {
        console.error("Eroare server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Biletele mele</h2>
      {tickets.length === 0 ? (
        <p>Nu ai bilete cumpărate momentan.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id}>
              <strong>{ticket.eventTitle}</strong> - {ticket.quantity} buc – {ticket.price} EUR
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTicketsPage;
