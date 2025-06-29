import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { useCart } from "../context/CartContext";

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

  const { cartItems } = useCart();
  const totalTickets = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  : 0;

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
    <nav className="navbar relative z-[1001]">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Logo" />
        </Link>
  
  
        {/* Linkuri principale */}
        <div className="nav-links">
          <div className="user-dropdown" ref={eventDropdownRef}>
            <button
              className={`nav-link ${location.pathname.includes("/events") ? "active-link" : ""}`}
              onClick={() => setShowEventDropdown((prev) => !prev)}
            >
              Evenimente
            </button>
            {showEventDropdown && (
              <div
                className="absolute mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-[1001] animate-fadeIn"
                onMouseEnter={() => setShowEventDropdown(true)}
                onMouseLeave={() => setShowEventDropdown(false)}
              >
                {[
                  "concert", "cinema", "theatre", "exhibition", "sport",
                  "festival", "conference", "workshop", "family", "business"
                ].map((type) => (
                  <Link
                    key={type}
                    to={`/events?type=${type}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#C89459] transition whitespace-nowrap"
                    onClick={() => setShowEventDropdown(false)}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </Link>
                ))}
              </div>
            )}
          </div>
  
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
              Administrare
            </Link>
          )}

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="search-form flex items-center gap-2 bg-white rounded-xl px-3 py-1 shadow-sm transition focus-within:ring-2 focus-within:ring-[#2A9D8F]"
          >
            <input
              type="text"
              placeholder="Caută..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[400px] bg-transparent outline-none text-[#26415E] placeholder-gray-500 text-sm"
            />
            <button type="submit" className="text-white bg-[#2A9D8F] hover:bg-[#1D5C5F] px-2 py-1 rounded-md transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
          </form>


        </div>
  
        {/* Tot ce e in dreapta */}
        <div className="navbar-right">
          {user ? (
            <>
              {/* Avatar + Dropdown */}
              <div className="user-dropdown" ref={userDropdownRef}>
                <button className="user-button" onClick={() => setShowUserDropdown((prev) => !prev)}>
                  <img
                    src={user?.profileImage ? `http://localhost:3000${user.profileImage}` : "/default-avatar.png"}
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                    alt="Avatar"
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", marginRight: "8px" }}
                  />
                  {user.name || "Cont"}
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white z-[1001] animate-fadeIn">
                    <div className="py-1 flex flex-col text-sm text-[#26415E]">
                      <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 hover:text-[#C89459]">Profilul Meu</Link>
                      <Link to="/my-tickets" className="px-4 py-2 hover:bg-gray-100 hover:text-[#C89459]">Biletele Mele</Link>
                      {user?.role === "organizer" && (
                        <Link to="/my-events" className="px-4 py-2 hover:bg-gray-100 hover:text-[#C89459]">
                          Evenimentele Mele
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          navigate("/auth");
                        }}
                        className="text-left w-full px-4 py-2 hover:bg-gray-100 hover:text-[#C89459]"
                      >
                        Deconectare
                      </button>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Buton Cos */}
              <div className="ml-2">
                <button
                  onClick={() => navigate("/cart")}
                  className="relative flex items-center gap-2 rounded-xl px-4 py-2 bg-[#2A9D8F] text-white font-semibold hover:bg-[#1D5C5F] transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.837l.383 1.446M7.5 14.25a3 3 0 100 6 3 3 0 000-6zm9 0a3 3 0 100 6 3 3 0 000-6zM7.5 14.25h9.379c.621 0 1.162-.392 1.361-.98l2.322-6.96a1.125 1.125 0 00-1.073-1.51H5.108" />
                  </svg>
                  <span>Coș</span>
                  {totalTickets > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#C89459] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalTickets}
                    </span>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <button className="auth-button" onClick={() => navigate("/auth")}>Autentificare</button>
            </div>
          )}
  
          {/* Buton Light/Dark */}
          <button onClick={toggleTheme} className="theme-toggle ml-2">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
  
}

export default Navbar;
