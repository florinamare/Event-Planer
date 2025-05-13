import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function CartPage() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
  
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        if (res.ok) {
          setCartItems(data.items || []);
        } else {
          console.error("Eroare:", data.message);
        }
      } catch (err) {
        console.error("Eroare server:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
  }, [user]);
  

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/cart/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Checkout realizat cu succes!");
        setCartItems([]); // golește coșul
      } else {
        setMessage(data.message || "Eroare la checkout.");
      }
    } catch (err) {
      setMessage("Eroare la server.");
    }
  };

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele din coș...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Coșul de Bilete</h2>
      {cartItems.length === 0 ? (
        <p>Coșul tău este gol.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <strong>{item.eventTitle}</strong> – {item.quantity} x {item.ticketType} ({item.price} EUR)
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            className="auth-button"
            style={{ marginTop: "20px" }}
          >
            Finalizează Checkout
          </button>
        </>
      )}
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default CartPage;
