import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("concert");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [image, setImage] = useState(null);
  const [tickets, setTickets] = useState([{ type: "", price: "", quantity: "" }]);

  const navigate = useNavigate();

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Eroare la autocomplete locație:", err);
    }
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const addTicket = () => {
    setTickets([...tickets, { type: "", price: "", quantity: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Trebuie să fii autentificat pentru a crea un eveniment.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("date", eventDate);
    formData.append("location", location);
    if (image) formData.append("image", image);
    formData.append("tickets", JSON.stringify(tickets));

    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert("Eveniment creat cu succes!");
      navigate("/");
    } else {
      alert(data.message || "Eroare la crearea evenimentului.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-[#E6E6E6] dark:bg-[#0B1B32] transition-colors duration-500">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1D5C5F] shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#2A9D8F] dark:text-[#A8DADC]">
          Creează un Eveniment
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Titlu Eveniment"
            className="w-full border rounded px-4 py-2 bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descriere"
            className="w-full border rounded px-4 py-2 bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            className="w-full border rounded px-4 py-2 bg-white dark:bg-[#0B1B32] text-black dark:text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="conference">Conference</option>
            <option value="festival">Festival</option>
            <option value="sport">Sport</option>
            <option value="workshop">Workshop</option>
            <option value="concert">Concert</option>
            <option value="theatre">Theatre</option>
            <option value="cinema">Cinema</option>
            <option value="exhibition">Exhibition</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
          </select>

          <label className="block font-semibold text-black dark:text-white">
            Data și ora evenimentului:
          </label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border rounded px-4 py-2 bg-white dark:bg-[#0B1B32] text-black dark:text-white"
            required
          />

          <div className="relative">
            <input
              type="text"
              placeholder="Locație"
              className="w-full border rounded px-4 py-2 bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
              value={location}
              onChange={(e) => {
                const value = e.target.value;
                setLocation(value);
                fetchLocationSuggestions(value);
              }}
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white dark:bg-[#1D5C5F] text-black dark:text-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setLocation(item.display_name);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-[#2A9D8F] cursor-pointer"
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1 text-black dark:text-white">Imagine Eveniment:</label>
            <input
              type="file"
              className="w-full text-black dark:text-white"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <h4 className="font-semibold mt-4 mb-2 text-black dark:text-white">Tipuri de bilete</h4>
            {tickets.map((ticket, index) => (
              <div key={index} className="grid grid-cols-3 gap-3 mb-2">
                <input
                  type="text"
                  placeholder="Tip (ex: VIP)"
                  className="border p-2 rounded bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  value={ticket.type}
                  onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Preț"
                  className="border p-2 rounded bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Cantitate"
                  className="border p-2 rounded bg-white dark:bg-[#0B1B32] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  value={ticket.quantity}
                  onChange={(e) => handleTicketChange(index, "quantity", e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTicket}
              className="text-sm text-white bg-[#2A9D8F] px-3 py-1 rounded hover:bg-[#1D5C5F] transition"
            >
              + Adaugă alt tip de bilet
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C89459] text-white py-2 rounded font-semibold hover:opacity-90 transition"
          >
            Creează Eveniment
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
