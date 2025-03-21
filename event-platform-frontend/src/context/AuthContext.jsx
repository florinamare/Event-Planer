import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔹 Token la inițializare:", token); // ✅ Vezi ce token ai în localStorage

    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Utilizator autentificat:", data); // ✅ Verifică datele utilizatorului
        setUser(data);
      } else {
        console.warn("⚠️ Token invalid, se face logout...");
        logout();
      }
    } catch (error) {
      console.error("❌ Eroare la preluarea utilizatorului:", error);
      logout();
    }
  };

  const login = (token) => {
    console.log("🔹 Login cu token:", token); // ✅ Vezi token-ul la login
    localStorage.setItem("token", token);
    fetchUserData(token);
  };

  const logout = () => {
    console.log("🔹 Logout efectuat.");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
