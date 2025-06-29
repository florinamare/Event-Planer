import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user === null) {
    // incă se încarcă sau nu e autentificat
    return <Navigate to="/auth" />;
  }

  return children;
}

export default PrivateRoute;
