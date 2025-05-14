const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/auth");
const Ticket = require("../models/Ticket");

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

    // 🔍 Obține eventul și biletul aferent tipului
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evenimentul nu a fost găsit." });

    const ticketType = event.tickets.find(t => t.type === type);
    if (!ticketType) return res.status(404).json({ message: "Tipul de bilet nu a fost găsit." });

    // 🔁 Caută dacă există deja acest tip de bilet în coș
    const existingItem = cart.items.find(
      (item) => item.event.toString() === eventId && item.type === type
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = ticketType.price; // 🟢 actualizează prețul dacă se modifică
    } else {
      cart.items.push({
        event: eventId,
        type,
        quantity,
        price: ticketType.price, // ✅ salvăm prețul acum
      });
    }

    await cart.save();
    res.json({ message: "Bilet adăugat în coș", cart });
  } catch (err) {
    console.error("❌ Eroare la adăugare:", err);
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

    const cart = await Cart.findOne({ user: userId }).populate("items.event");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Coșul este gol." });
    }

    const ticketsToSave = [];

    for (const item of cart.items) {
      const ticketInfo = item.event.tickets?.find(t => t.type === item.type);
      if (!ticketInfo) continue; // sare peste dacă nu găsește tipul de bilet

      ticketsToSave.push({
        user: userId,
        event: item.event._id,
        eventTitle: item.event.title,
        quantity: item.quantity,
        price: ticketInfo.price,
        ticketType: item.type,
      });
      
    }

    if (ticketsToSave.length === 0) {
      return res.status(400).json({ message: "Nu s-au putut procesa biletele." });
    }

    await Ticket.insertMany(ticketsToSave);
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ message: "Checkout finalizat cu succes!", tickets: ticketsToSave });
  } catch (err) {
    console.error("❌ Eroare la checkout:", err);
    res.status(500).json({ message: "Eroare la procesarea checkout-ului." });
  }
});

  
module.exports = router;
