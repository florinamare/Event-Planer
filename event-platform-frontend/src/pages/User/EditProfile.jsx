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
        login(token);
      } else {
        setMessage(data.message || "Eroare la actualizare.");
      }
    } catch (error) {
      setMessage("Eroare la conectare cu serverul.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-28 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-[#2A9D8F] mb-6">
        ✏️ Editare Profil
      </h2>

      {preview && (
        <div className="flex justify-center mb-6">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#A8DADC]"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-[#26415E] mb-1">Nume:</label>
          <input
            type="text"
            value={name}
            placeholder="Numele tău"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#26415E] mb-1">Imagine de profil:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block text-sm text-gray-700"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#1D5C5F] transition font-medium"
        >
          💾 Salvează modificările
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-[#1D5C5F] font-medium">{message}</p>
      )}
    </div>
  );
}

export default EditProfile;
