import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ Importă AuthProvider
import Home from "./pages/Home";
import EventsList from "./pages/Events/EventsList";
import EventDetails from "./pages/Events/EventDetails";
import CreateEvent from "./pages/Events/CreateEvent";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register"; // ✅ Importă pagina de înregistrare
import AdminPanel from "./pages/Auth/AdminPanel"; // ✅ Importă AdminPanel

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* ✅ Adaugă AuthProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/admin" element={<AdminPanel />} /> {/* ✅ Adaugă ruta pentru AdminPanel */}
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
