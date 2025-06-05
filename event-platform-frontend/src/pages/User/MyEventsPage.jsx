import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  if (loading) return <p className="p-6">Se încarcă evenimentele...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[#2A9D8F]">
        <CalendarDays className="w-7 h-7" />
        Evenimentele Mele
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">Nu ai creat încă niciun eveniment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 flex flex-col items-center text-center"
            >
              <img
                src={`http://localhost:3000${event.image}`}
                alt="event"
                className="w-full max-w-xs h-48 object-cover rounded-md mb-4"
              />

              <h3 className="text-xl font-semibold text-[#1D5C5F] mb-2">{event.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString("ro-RO")}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(event._id)}
                  className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Editează
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEventsPage;
