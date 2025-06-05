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
        body: JSON.stringify({ eventId, type, quantity: newQuantity }),
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
            setLocalCart(data.items.map((item) => ({ ...item })));
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

      const res = await fetch("http://localhost:3000/api/cart/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Checkout finalizat cu succes!");
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

  const handleCheckoutClick = () => {
    setCheckoutStarted(true);
  };

  const total = localCart
    .reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0)
    .toFixed(2);

  if (!user) return <p className="p-6">Nu ești autentificat.</p>;
  if (loading) return <p className="p-6">Se încarcă biletele din coș...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">🛒 Coșul de Bilete</h2>

      {message === "Checkout finalizat cu succes!" ? (
        <div className="mt-10 text-center">
          <svg
            className="mx-auto w-24 h-24 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xl font-semibold text-green-600 mt-4">
            Checkout finalizat cu succes!
          </p>
        </div>
      ) : localCart.length === 0 ? (
        <p className="text-gray-500">Coșul tău este gol.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {localCart.map((item, index) => (
              <li
                key={item._id}
                className="border p-4 rounded-xl shadow-md flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{item.event.title}</p>
                  <p className="text-sm text-gray-600">
                    Tip: {item.type} —{" "}
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
                      className="w-16 ml-2 border rounded px-2 py-1"
                    />
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.event._id, item.type)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️ Șterge
                </button>
              </li>
            ))}
          </ul>

          <p className="text-lg font-bold mt-6">
            Total de plată: <span className="text-green-600">{total} EUR</span>
          </p>

          {!checkoutStarted ? (
            <button
              onClick={handleCheckoutClick}
              className="bg-[#2A9D8F] hover:bg-[#1D5C5F] text-white px-6 py-2 rounded-xl mt-6 transition duration-200"
            >
              Finalizează Checkout
            </button>
          ) : (
            <form
              onSubmit={handlePaymentSubmit}
              className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4">💳 Detalii card (simulare)</h3>

              <label className="block mb-2">Nume pe card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />

              <label className="block mb-2">Număr card</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />

              <label className="block mb-2">Expirare</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />

              <label className="block mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />

              <button
                type="submit"
                className="bg-[#2A9D8F] hover:bg-[#1D5C5F] text-white px-6 py-2 rounded-xl mt-2"
              >
                Plătește
              </button>
            </form>
          )}
        </>
      )}

      {message && message !== "Checkout finalizat cu succes!" && (
        <p className="mt-6 text-sm text-center text-red-500">{message}</p>
      )}
    </div>
  );
}

export default CartPage;
