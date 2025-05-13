import { useContext } from "react";
import "../../styles/ProfilePage.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div>Se încarcă...</div>;

  return (
    <div className="profile-page" style={{ padding: "2rem", maxWidth: "600px", margin: "80px auto" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>👤 Profilul Meu</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <img
          src={
            user.profileImage
              ? `http://localhost:3000${user.profileImage}`
              : "/default-avatar.png"
          }
          alt="Poza de profil"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ccc",
          }}
        />
        <div>
          <p><strong>Nume:</strong> {user.name || "Nespecificat"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      </div>

      <button
        className="auth-button"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0056b3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/profile/edit")}
      >
        ✏️ Editează Profilul
      </button>
    </div>
  );
}

export default ProfilePage;
