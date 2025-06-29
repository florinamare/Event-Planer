import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const { fetchCart } = useCart();

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

  const handleAddToCart = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    if (!selectedTicket || quantity <= 0) {
      setMessage("Selectează un tip de bilet și cantitate validă.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          type: selectedTicket,
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(" Biletele au fost adăugate în coș!");
        fetchCart();
      } else {
        setMessage(data.message || "Eroare la adăugare în coș.");
      }
    } catch (error) {
      setMessage("Eroare la conectare cu serverul.");
    }
  };

  if (loading) return <h1 className="text-center mt-20">Se încarcă detaliile...</h1>;
  if (!event) return <h1 className="text-center mt-20">Evenimentul nu a fost găsit.</h1>;

  return (
    <div className="mt-24 px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-8 bg-[#E6E6E6] dark:bg-[#0B1B32] text-[#1D5C5F] dark:text-white p-6 rounded-lg shadow-md">
        {event.image && (
          <img
          src={`http://localhost:3000${event.image}`}
          alt="Imagine eveniment"
          className="w-full md:w-[50%] h-auto max-h-[400px] object-contain rounded-lg bg-white p-2"
        />        
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-[#2A9D8F] dark:text-[#A8DADC]">{event.title}</h1>
          <p className="mb-2">{event.description}</p>

          <p className="mb-2">
            <strong>Locație:</strong> {event.location?.address || "Nespecificată"}
            {event.location?.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-700 dark:text-blue-300 hover:underline font-medium"
              >
                Vezi pe Google Maps
              </a>
            )}
          </p>

          <p className="mb-4">
            <strong>Data & Ora:</strong>{" "}
            {new Date(event.date).toLocaleDateString("ro-RO")} –{" "}
            {new Date(event.date).toLocaleTimeString("ro-RO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <hr className="my-4 border-gray-400 dark:border-gray-600" />

          <h3 className="text-xl font-semibold mb-2">🎫 Bilete disponibile:</h3>
          <ul className="mb-4 list-disc pl-6">
            {event.tickets?.map((ticket, index) => (
              <li key={index}>
                <strong>{ticket.type}</strong> — {ticket.price} LEI (disponibile: {ticket.quantity})
              </li>
            ))}
          </ul>

          {user ? (
            <div className="space-y-4">
              <div>
                <label className="font-semibold mr-2">Tip bilet:</label>
                <select
                  value={selectedTicket}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Selectează --</option>
                  {event.tickets?.map((ticket, index) => (
                    <option key={index} value={ticket.type}>
                      {ticket.type} - {ticket.price} LEI
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold mr-2">Cantitate:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors duration-200"
              >
                🛒 Adaugă în coș
              </button>

              {message && <p className="text-sm text-gray-800 dark:text-gray-300">{message}</p>}
            </div>
          ) : (
            <p className="mt-4 text-yellow-700 dark:text-yellow-300">🔒 Trebuie să fii autentificat pentru a cumpăra bilete.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
