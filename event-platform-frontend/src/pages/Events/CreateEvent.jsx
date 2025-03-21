import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Concert"); // 🔹 Adaugă tipul evenimentului
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Trebuie să fii autentificat pentru a crea un eveniment.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, type, date, location }), // 🔹 Adaugă `type` în request
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
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
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
          <option value="Concert">Concert</option> {/* 🔹 Prima literă mare, exact ca în schema */}
          </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Locație"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white p-2 rounded">Creează Eveniment</button>
      </form>
    </div>
  );
}

export default CreateEvent;
