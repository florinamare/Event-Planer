import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GuestRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user !== null) {
    return <Navigate to="/events" />;
  }

  return children;
}

export default GuestRoute;
