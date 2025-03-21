import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Event Platform</h1>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Acasă</Link>
          <Link to="/events" onClick={() => setIsOpen(false)}>Evenimente</Link>
          <Link to="/create-event" onClick={() => setIsOpen(false)}>Adaugă Eveniment</Link>
        </div>
        
        {/* ✅ Buton de autentificare */}
        {user ? (
          <button className="auth-button" onClick={() => { logout(); navigate("/login"); }}>
            Deconectare
          </button>
        ) : (
          <button className="auth-button" onClick={() => navigate("/login")}>
            Autentificare
          </button>
        )}

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
