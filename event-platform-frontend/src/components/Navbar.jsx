// ✅ Navbar.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";


function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setIsOpen(false); // închide meniul mobil dacă e deschis
    }
  };
  
  


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
        <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Caută evenimente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </form>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Acasă</Link>
          <div className="relative group">
          <button className="nav-link">Evenimente ⬇</button>

          <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white shadow-md rounded z-50 min-w-[160px] text-black">
            {[
              "concert",
              "cinema",
              "theatre",
              "exhibition",
              "sport",
              "festival",
              "conference",
              "workshop",
              "family",
              "business"
            ].map((type) => (
              <Link
                key={type}
                to={`/events?type=${type}`}
                className="px-4 py-2 hover:bg-blue-100 whitespace-nowrap"
              >
                {type[0].toUpperCase() + type.slice(1)}
              </Link>
            ))}
          </div>
        </div>

          <Link to="/map" onClick={() => setIsOpen(false)}>Harta Evenimentelor</Link>

          {/* ✅ Afișează doar pentru organizator și admin */}
          {(user?.role === "organizer" || user?.role === "admin") && (
            <Link to="/create-event" onClick={() => setIsOpen(false)}>Adaugă Eveniment</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin-panel" className="nav-link">
              Admin
            </Link>
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
