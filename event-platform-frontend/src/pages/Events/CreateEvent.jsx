// CreateEvent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Concert");
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

    console.log("🔍 Bilete pregătite pentru trimitere:", tickets);
    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Fără Content-Type aici!
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Creează un Eveniment</h2>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >

        <input
          type="text"
          placeholder="Titlu Eveniment"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descriere"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="conference">Conferință</option>
          <option value="festival">Festival</option>
          <option value="sport">Sport</option>
          <option value="workshop">Atelier</option>
          <option value="Concert">Concert</option>
        </select>

        <label>Data și ora evenimentului:</label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

          <div className="relative">
            <input
              type="text"
              placeholder="Locație"
              className="border p-2 rounded w-full"
              value={location}
              onChange={(e) => {
                const value = e.target.value;
                setLocation(value);
                fetchLocationSuggestions(value);
              }}
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setLocation(item.display_name);
                      setSuggestions([]);
                    }}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>


        <label>Imagine Eveniment:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <h4 className="font-semibold mt-4">Tipuri de bilete</h4>
    {tickets.map((ticket, index) => (
      <div key={index} className="grid grid-cols-3 gap-2 items-center">
        <input
          type="text"
          placeholder="Tip (ex: VIP)"
          className="border p-2 rounded"
          value={ticket.type}
          onChange={(e) => handleTicketChange(index, "type", e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preț"
          className="border p-2 rounded"
          value={ticket.price}
          onChange={(e) => {
            const updated = [...tickets];
            updated[index].price = e.target.value;
            setTickets(updated);
          }}
          required
        />
        <input
          type="number"
          placeholder="Cantitate"
          className="border p-2 rounded"
          value={ticket.quantity}
          onChange={(e) => {
            const updated = [...tickets];
            updated[index].quantity = e.target.value;
            setTickets(updated);
          }}
          required
        />
      </div>
    ))}

<button
  type="button"
  onClick={() => setTickets([...tickets, { type: "", price: "", quantity: "" }])}
  className="bg-blue-500 text-white px-2 py-1 rounded w-fit mt-2"
>
  + Adaugă alt tip de bilet
</button>

        <button className="bg-green-500 text-white p-2 rounded">Creează Eveniment</button>
      </form>
    </div>
  );
}

export default CreateEvent;
