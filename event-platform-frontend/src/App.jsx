import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventsList from "./pages/Events/EventsList";
import EventDetails from "./pages/Events/EventDetails";
import CreateEvent from "./pages/Events/CreateEvent";
import SignInSignUp from "./components/SignInSignUp";
import ProfilePage from "./pages/User/ProfilePage";
import MyTicketsPage from "./pages/User/MyTicketsPage";
import EditProfile from "./pages/User/EditProfile";
import CartPage from "./pages/User/CartPage";

function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function GuestRoute({ children }) {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to="/" />;
}

function App() {
  const { user } = useContext(AuthContext);

  // Până când determinăm dacă user-ul este autentificat, afișăm un fallback
  if (user === undefined) return <div>Se verifică autentificarea...</div>;

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          <Route
            path="/create-event"
            element={
              <PrivateRoute role="organizer">
                <CreateEvent />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-tickets"
            element={
              <PrivateRoute>
                <MyTicketsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/auth"
            element={
              <GuestRoute>
                <SignInSignUp />
              </GuestRoute>
            }
          />

          <Route path="/profile/edit" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />


        <Route path="*" element={<div>404 - Pagina nu a fost găsită</div>} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
