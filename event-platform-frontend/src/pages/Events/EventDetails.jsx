import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Eroare la preluarea evenimentului:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handlePurchase = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    if (!selectedTicket || quantity <= 0) {
      setMessage("Selectează un tip de bilet și cantitate validă.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tickets/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          ticketType: selectedTicket,
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Biletele au fost cumpărate cu succes!");
      } else {
        setMessage(data.message || "Eroare la achiziție.");
      }
    } catch (error) {
      setMessage("Eroare la conectare cu serverul.");
    }
  };

  if (loading) return <h1>Se încarcă detaliile...</h1>;
  if (!event) return <h1>Evenimentul nu a fost găsit.</h1>;

  return (
    <div className="p-4" style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1 style={{ fontSize: "1.8rem" }}>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Locație:</strong> {event.location?.address || "Nespecificată"}</p>
      <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</p>

      <hr style={{ margin: "20px 0" }} />

      <h3>🎫 Bilete disponibile:</h3>
      <ul>
        {event.tickets?.map((ticket, index) => (
          <li key={index}>
            <strong>{ticket.type}</strong> — {ticket.price} EUR (disponibile: {ticket.quantity})
          </li>
        ))}
      </ul>

      {user ? (
        <div style={{ marginTop: "20px" }}>
          <label>
            Tip bilet:
            <select
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="">-- Selectează --</option>
              {event.tickets?.map((ticket, index) => (
                <option key={index} value={ticket.type}>
                  {ticket.type} - {ticket.price} EUR
                </option>
              ))}
            </select>
          </label>

          <br />

          <label style={{ marginTop: "10px", display: "inline-block" }}>
            Cantitate:
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ marginLeft: "10px", width: "60px" }}
            />
          </label>

          <br />
          <button
            onClick={handlePurchase}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "10px 15px",
              marginTop: "15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cumpără Bilete
          </button>

          {message && <p style={{ marginTop: "15px", color: "#333" }}>{message}</p>}
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>🔒 Trebuie să fii autentificat pentru a cumpăra bilete.</p>
      )}
    </div>
  );
}

export default EventDetails;
