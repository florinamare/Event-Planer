import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

function EditProfile() {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.profileImage) {
      setPreview(`http://localhost:3000${user.profileImage}`);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profil actualizat cu succes.");
        login(token); // refacem login ca să actualizăm datele
      } else {
        setMessage(data.message || "Eroare la actualizare.");
      }
    } catch (error) {
      setMessage("Eroare la conectare cu serverul.");
    }
  };

  return (
    <div className="edit-profile-page" style={{ maxWidth: 500, margin: "80px auto" }}>
      <h2>Editare Profil</h2>

      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nume:</label>
          <input
            type="text"
            value={name}
            placeholder="Numele tău"
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
        </div>

        <div>
          <label>Imagine de profil:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#0056b3",
            color: "white",
            padding: "10px 15px",
            marginTop: "15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Salvează modificările
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "#333" }}>{message}</p>}
    </div>
  );
}

export default EditProfile;
