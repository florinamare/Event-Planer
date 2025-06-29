import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔹 Răspuns login:", data); // Verifica ce primesti ca raspuns

      if (res.ok && data.token) {
        login(data.token);
        navigate("/events");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(" Eroare la autentificare:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Autentificare</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Parolă" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Autentificare</button>
      </form>
    </div>
  );
}

export default Login;
