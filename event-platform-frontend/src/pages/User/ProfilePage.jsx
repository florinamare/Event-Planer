// src/pages/User/ProfilePage.jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Nu ești autentificat.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profilul meu</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      {user.name && <p><strong>Nume:</strong> {user.name}</p>}
    </div>
  );
}

export default ProfilePage;
