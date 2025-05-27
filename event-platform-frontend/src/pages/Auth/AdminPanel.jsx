import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user?.role === "admin" && token) {
      fetch("http://localhost:3000/api/users/pending-organizers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setPendingUsers(data))
        .catch((err) => console.error("Eroare la fetch:", err));
    } else {
      navigate("/"); // redirecționează dacă nu e admin
    }
  }, [user]);

  const approveUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/users/approve/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        alert("✅ Utilizator aprobat ca organizator!");
      } else {
        alert("❌ Eroare la aprobare");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>🛠️ Panel Administrator</h2>
      <h4>Cereri de organizatori:</h4>
      {pendingUsers.length === 0 ? (
        <p>Nu sunt cereri în așteptare.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pendingUsers.map((user) => (
            <li
              key={user._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{user.name}</strong> <br />
                {user.email}
              </div>
              <button
                onClick={() => approveUser(user._id)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✅ Aproba
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;
