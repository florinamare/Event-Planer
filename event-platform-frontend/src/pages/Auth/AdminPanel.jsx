import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);

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
        alert("Utilizator aprobat!");
      } else {
        alert("Eroare la aprobare");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aprobă Organizatori</h2>
      {pendingUsers.length === 0 ? (
        <p>Nu sunt utilizatori de aprobat.</p>
      ) : (
        <ul className="space-y-2">
          {pendingUsers.map((user) => (
            <li key={user._id} className="border p-2 rounded flex justify-between items-center">
              <span>{user.email}</span>
              <button
                onClick={() => approveUser(user._id)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Aproba
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;
