import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div className="text-center py-20 text-gray-500">Se încarcă...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-28 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-[#2A9D8F] mb-8 text-center">
        👤 Profilul Meu
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <img
          src={
            user.profileImage
              ? `http://localhost:3000${user.profileImage}`
              : "/default-avatar.png"
          }
          alt="Poza de profil"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#A8DADC]"
        />
        <div className="text-left text-[#26415E] text-base">
          <p><span className="font-medium">Nume:</span> {user.name || "Nespecificat"}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Rol:</span> {user.role}</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-6 py-2 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#1D5C5F] transition"
        >
         Editează Profilul
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
