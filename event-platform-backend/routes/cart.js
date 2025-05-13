const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/auth");

// ✅ [GET] Obține coșul utilizatorului
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.event");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea coșului." });
  }
});

// ✅ [POST] Adaugă sau actualizează un bilet în coș
router.post("/add", authMiddleware, async (req, res) => {
  const { eventId, type, quantity } = req.body;

  if (!eventId || !type || !quantity)
    return res.status(400).json({ message: "Toate câmpurile sunt necesare." });

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Verificăm dacă există deja acest bilet în coș
    const existingItem = cart.items.find(
      (item) => item.event.toString() === eventId && item.type === type
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ event: eventId, type, quantity });
    }

    await cart.save();
    res.json({ message: "Bilet adăugat în coș", cart });
  } catch (err) {
    res.status(500).json({ message: "Eroare la adăugare în coș." });
  }
});

// ✅ [DELETE] Șterge un bilet din coș
router.delete("/remove", authMiddleware, async (req, res) => {
  const { eventId, type } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Coșul nu a fost găsit." });

    cart.items = cart.items.filter(
      (item) => !(item.event.toString() === eventId && item.type === type)
    );

    await cart.save();
    res.json({ message: "Bilet șters din coș", cart });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergere din coș." });
  }
});

// POST /api/cart/checkout
router.post("/checkout", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await Cart.find({ user: userId }).populate("event");
  
      if (!cartItems.length) {
        return res.status(400).json({ message: "Coșul este gol." });
      }
  
      // Creează bilete pentru fiecare articol din coș
      const ticketsToSave = cartItems.map((item) => ({
        user: userId,
        event: item.event._id,
        eventTitle: item.event.title,
        quantity: item.quantity,
        price: item.price,
      }));
  
      // Salvăm toate biletele odată
      await Ticket.insertMany(ticketsToSave);
  
      // Șterge articolele din coș
      await Cart.deleteMany({ user: userId });
  
      res.status(201).json({ message: "Checkout finalizat cu succes!", tickets: ticketsToSave });
    } catch (err) {
      console.error("Eroare la checkout:", err);
      res.status(500).json({ message: "Eroare la procesarea checkout-ului." });
    }
  });
  
module.exports = router;
