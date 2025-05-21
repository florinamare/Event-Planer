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
  const [localCart, setLocalCart] = useState([]);


  const handleRemoveItem = async (eventId, type) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, type }),
    });
  
    const data = await res.json();
    if (res.ok) {
      setCartItems(data.cart.items);
    } else {
      setMessage(data.message || "Eroare la ștergere.");
    }
  };
  
  const handleQuantityChange = async (eventId, type, newQuantity) => {
    if (newQuantity <= 0) return;
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("http://localhost:3000/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, type, quantity: newQuantity }), // 🟢 corect
      });
  
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart.items);
      } else {
        setMessage(data.message || "Eroare la actualizarea cantității.");
      }
    } catch (err) {
      console.error("❌ Eroare la comunicarea cu serverul:", err);
      setMessage("Eroare la comunicarea cu serverul.");
    }
  };
  
  

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:3000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setCartItems(data.items || []);
            setLocalCart(data.items.map(item => ({ ...item }))); // copie locală
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
    }
  }, [user]);
  

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
  
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setMessage("Te rugăm să completezi toate câmpurile.");
      return;
    }
  
    // 🟡 Sincronizăm localCart pe server
    try {
      const token = localStorage.getItem("token");
  
      for (const item of localCart) {
        await fetch("http://localhost:3000/api/cart/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: item.event._id,
            type: item.type,
            quantity: item.quantity,
          }),
        });
      }
  
      // 🔵 Trimitem request de checkout
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
        setLocalCart([]);
        setCheckoutStarted(false);
        setCardName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
      } else {
        setMessage(data.message || "Eroare la checkout.");
      }
    } catch (err) {
      console.error("❌ Eroare la server:", err);
      setMessage("Eroare la server.");
    }
  };
  

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele din coș...</p>;

    const handleCheckoutClick = () => {
      setCheckoutStarted(true);
    };
  
    const total = localCart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0).toFixed(2);
    
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Coșul de Bilete</h2>
      {localCart.length === 0 ? (
        <p>Coșul tău este gol.</p>
      ) : (
        <>
          <ul>
          {localCart.map((item, index) => (
            <li key={item._id}>
              <strong>{item.event.title}</strong> –
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const updated = [...localCart];
                  updated[index].quantity = parseInt(e.target.value);
                  setLocalCart(updated);
                }}
                onBlur={() => {
                  if (item.quantity !== cartItems[index]?.quantity) {
                    handleQuantityChange(item.event._id, item.type, item.quantity);
                  }
                }}
                style={{ width: "60px", marginLeft: "10px" }}
              />
              x {item.type}
              <button
                onClick={() => handleRemoveItem(item.event._id, item.type)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                🗑️ Șterge
              </button>
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
