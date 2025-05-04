import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div>Se încarcă...</div>;

  return (
    <div className="profile-page" style={{ padding: "2rem" }}>
      <h2>Profilul Meu</h2>
      <p><strong>Nume:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {user.profileImage && (
        <img
          src={`http://localhost:3000${user.profileImage}`}
          alt="Poza de profil"
          style={{ width: "150px", borderRadius: "10px", marginTop: "10px" }}
        />
      )}

      <br />
      <button
        className="auth-button"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/profile/edit")}
      >
        Editează Profilul
      </button>
    </div>
  );
}

export default ProfilePage;
