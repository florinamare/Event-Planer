import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wantsOrganizer, setWantsOrganizer] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Setam rolul în functie de bifa
    const role = wantsOrganizer ? "pending_organizer" : "user";

    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Cont creat! Dacă ai cerut să fii organizator, un admin va aproba contul.");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Înregistrare</h2>
      <form className="flex flex-col space-y-4 w-80" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parolă"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={wantsOrganizer}
            onChange={(e) => setWantsOrganizer(e.target.checked)}
          />
          <span>Vreau să fiu organizator (necesită aprobare)</span>
        </label>
        <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded">
          Înregistrează-te
        </button>
      </form>
    </div>
  );
}

export default Register;
