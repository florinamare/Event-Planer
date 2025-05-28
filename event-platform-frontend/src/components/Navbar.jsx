import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
      <Link to="/" className="logo">
      <img src="/logo.png" alt="Logo" />
      </Link>



        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Caută evenimente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </form>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>

          <div className="user-dropdown" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <button className={`nav-link ${location.pathname.includes("/events") ? "active-link" : ""}`}>
              Evenimente
            </button>
            {showDropdown && (
              <div className="dropdown-menu" ref={dropdownRef}>
                {["concert", "cinema", "theatre", "exhibition", "sport", "festival", "conference", "workshop", "family", "business"]
                  .map((type) => (
                    <Link key={type} to={`/events?type=${type}`}>
                      {type[0].toUpperCase() + type.slice(1)}
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <Link to="/map" className={`nav-link ${isActive("/map") ? "active-link" : ""}`} onClick={() => setIsOpen(false)}>Harta Evenimentelor</Link>

          {(user?.role === "organizer" || user?.role === "admin") && (
            <Link to="/create-event" className={`nav-link ${isActive("/create-event") ? "active-link" : ""}`} onClick={() => setIsOpen(false)}>
              Adaugă Eveniment
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin-panel" className={`nav-link ${isActive("/admin-panel") ? "active-link" : ""}`}>Admin</Link>
          )}
        </div>

        {user ? (
          <>
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-button" onClick={() => setShowDropdown((prev) => !prev)}>
                <img
                  src={user?.profileImage ? `http://localhost:3000${user.profileImage}` : "/default-avatar.png"}
                  alt="Avatar"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", marginRight: "8px" }}
                />
                {user.name || "Cont"} ⬇
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profilul Meu</Link>
                  <Link to="/my-tickets">Biletele Mele</Link>
                  {user?.role === "organizer" && <Link to="/my-events">Evenimentele Mele</Link>}
                  <button onClick={() => { logout(); navigate("/auth"); }}>Deconectare</button>
                </div>
              )}
            </div>

            <button className="auth-button cart" onClick={() => navigate("/cart")}>🛒 Coș</button>
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
