import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function CartPage() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!cardName || !cardNumber || !expiry || !cvv) {
      setMessage("Te rugăm să completezi toate câmpurile.");
      return;
    }

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
        setMessage("✅ Checkout finalizat cu succes!");
        setCartItems([]);
        setCheckoutStarted(false);
        setCardName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
      } else {
        setMessage(data.message || "Eroare la checkout.");
      }
    } catch (err) {
      setMessage("Eroare la server.");
    }
  };

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele din coș...</p>;

    const handleCheckoutClick = () => {
      setCheckoutStarted(true);
    };
  
    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0).toFixed(2);
    
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
                <strong>{item.event.title}</strong> – {item.quantity} x {item.type}
              </li>
            ))}
          </ul>
          <p style={{ fontWeight: "bold", marginTop: "10px" }}>
            Total de plată: {total} EUR
          </p>

          {!checkoutStarted ? (
            <button
            onClick={handleCheckoutClick}

            className="auth-button"
            style={{ marginTop: "20px" }}
          >
            Finalizează Checkout
          </button>
          ) : (
            <form onSubmit={handlePaymentSubmit} style={{ marginTop: "20px", maxWidth: "400px" }}>
              <h3>💳 Detalii card (simulare)</h3>

              <label>Nume pe card:</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />

              <label>Număr card:</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />

              <label>Expirare:</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />

              <label>CVV:</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />

              <button
                type="submit"
                className="auth-button"
                style={{ marginTop: "10px" }}
              >
                Plătește
              </button>
            </form>
          )}
        </>
      )}

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default CartPage;
