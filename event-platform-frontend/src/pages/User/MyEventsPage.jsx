// frontend/src/pages/User/MyEventsPage.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  


  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/events/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          console.error("Eroare la încărcare:", data.message);
        }
      } catch (err) {
        console.error("Eroare la server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest eveniment?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setEvents(events.filter((ev) => ev._id !== id));
        alert("Eveniment șters.");
      } else {
        alert(data.message || "Eroare la ștergere.");
      }
    } catch (err) {
      console.error("Eroare:", err);
      alert("Eroare server.");
    }
  };

  if (loading) return <p>Se încarcă evenimentele...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Evenimentele Mele</h2>
      {events.length === 0 ? (
        <p>Nu ai creat încă niciun eveniment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded p-4 shadow">
              <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
              <img
            src={`http://localhost:3000${event.image}`}
            alt="event"
            style={{
              width: "100%",
              maxWidth: "300px",       // Limitează dimensiunea
              height: "auto",
              objectFit: "cover",
              borderRadius: "10px",
              display: "block",
              margin: "0 auto"         // Centrează imaginea
            }}
          />

              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString("ro-RO")}
              </p>
              <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => navigate(`/edit-event/${event._id}`)}
              >
                Editează
              </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Șterge
                </button>
              </div>
            </div>
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
}

export default MyEventsPage;
