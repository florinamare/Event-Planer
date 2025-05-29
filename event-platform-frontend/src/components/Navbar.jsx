import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userDropdownRef = useRef();
const eventDropdownRef = useRef();
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
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target)) {
        setShowEventDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar relative z-50">
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

        <div className="nav-links">
          {/* DropDown Evenimente */}
          <div className="user-dropdown" ref={eventDropdownRef}>
            <button
              className={`nav-link ${location.pathname.includes("/events") ? "active-link" : ""}`}
              onClick={() => setShowEventDropdown((prev) => !prev)}
            >
              Evenimente
            </button>

            {showEventDropdown && (
              <div
                className="dropdown-menu"
                onMouseEnter={() => setShowEventDropdown(true)}
                onMouseLeave={() => setShowEventDropdown(false)}
              >
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
                    onClick={() => setShowEventDropdown(false)}
                    style={{ color: "white" }}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Restul linkurilor */}
          <Link
            to="/map"
            className={`nav-link ${isActive("/map") ? "active-link" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Harta Evenimentelor
          </Link>

          {(user?.role === "organizer" || user?.role === "admin") && (
            <Link
              to="/create-event"
              className={`nav-link ${isActive("/create-event") ? "active-link" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Adaugă Eveniment
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin-panel"
              className={`nav-link ${isActive("/admin-panel") ? "active-link" : ""}`}
            >
              Admin
            </Link>
          )}
        </div>  {/* <- închizi doar aici corect */}


        {/* Dropdown User */}
        {user ? (
          <>
            <div className="user-dropdown" ref={userDropdownRef}>
              <button className="user-button" onClick={() => setShowUserDropdown(prev => !prev)}>
                <img
                  src={user?.profileImage ? `http://localhost:3000${user.profileImage}` : "/default-avatar.png"}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                  alt="Avatar"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", marginRight: "8px" }}
                />
                {user.name || "Cont"} ⬇
              </button>

              {showUserDropdown && (
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
            <button className="auth-button" onClick={() => navigate("/auth")}>
              Autentificare
            </button>
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
