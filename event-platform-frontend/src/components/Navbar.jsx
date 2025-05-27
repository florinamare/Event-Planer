// ✅ Navbar.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <Link to="/map" onClick={() => setIsOpen(false)}>Harta Evenimentelor</Link>

          {/* ✅ Afișează doar pentru organizator și admin */}
          {(user?.role === "organizer" || user?.role === "admin") && (
            <Link to="/create-event" onClick={() => setIsOpen(false)}>Adaugă Eveniment</Link>
          )}
        </div>


        {user ? (
          <>
          <div
          className="user-dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button className="user-button" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
        src={
          user?.profileImage
            ? `http://localhost:3000${user.profileImage}`
            : "/default-avatar.png"
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-avatar.png";
        }}
        alt="Avatar"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "8px",
        }}
/>

          {user.name || "Cont"} ⬇
        </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile">Profilul Meu</Link>
              <Link to="/my-tickets">Biletele Mele</Link>
              {user?.role === "organizer" && (
                <li>
                  <Link to="/my-events">Evenimentele Mele</Link>
                </li>
              )}

              <button onClick={() => { logout(); navigate("/auth"); }}>Deconectare</button>
            </div>
          )}
        </div>
        
        <button
          className="auth-button cart"
          onClick={() => navigate("/cart")}
        >
          🛒 Coș
        </button>
        </>
       
        ) : (
          <div className="auth-buttons">
            <button className="auth-button" onClick={() => navigate("/auth")}>Autentificare</button>
          </div>
        )}

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
