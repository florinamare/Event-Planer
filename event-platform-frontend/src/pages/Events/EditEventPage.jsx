import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("concert");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [tickets, setTickets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Se încarcă editarea pentru evenimentul cu ID:", id);
    const fetchEvent = async () => {
      const res = await fetch(`http://localhost:3000/api/events/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setDescription(data.description);
      setType(data.type);
      setEventDate(data.date?.slice(0, 16));
      setLocation(data.location?.address || "");
      setTickets(data.tickets || []);
    };
    fetchEvent();
  }, [id]);

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
    const formData = new FormData();
  
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("date", eventDate);
    formData.append("location", location);
    if (image) formData.append("image", image);
  
    // ✅ Trimitem array-ul de bilete ca JSON string
    formData.append("tickets", JSON.stringify(tickets));
  
    const res = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (res.ok) {
      alert("Eveniment actualizat cu succes!");
      navigate("/");
    } else {
      const data = await res.json();
      alert(data.message || "Eroare la actualizare.");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Editează Eveniment</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titlu" className="border p-2 rounded" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descriere" className="border p-2 rounded" required />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded" required>
          <option value="conference">Conferință</option>
          <option value="festival">Festival</option>
          <option value="sport">Sport</option>
          <option value="workshop">Atelier</option>
          <option value="concert">Concert</option>
        </select>
        <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Locație" className="border p-2 rounded" required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <h4 className="font-semibold mt-4">Tipuri de bilete</h4>
        {tickets.map((ticket, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center">
            <input type="text" value={ticket.type} onChange={(e) => handleTicketChange(index, "type", e.target.value)} placeholder="Tip" className="border p-2 rounded" required />
            <input type="number" value={ticket.price} onChange={(e) => handleTicketChange(index, "price", e.target.value)} placeholder="Preț" className="border p-2 rounded" required />
            <input type="number" value={ticket.quantity} onChange={(e) => handleTicketChange(index, "quantity", e.target.value)} placeholder="Cantitate" className="border p-2 rounded" required />
          </div>
        ))}

        <button type="button" onClick={addTicket} className="bg-blue-500 text-white px-2 py-1 rounded w-fit mt-2">+ Adaugă tip bilet</button>
        <button className="bg-green-500 text-white p-2 rounded">Salvează Modificările</button>
      </form>
    </div>
  );
}

export default EditEvent;
