const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/auth");

// POST /api/tickets/purchase
router.post("/purchase", authMiddleware, async (req, res) => {
  try {
    const { eventId, ticketType, quantity } = req.body;

    if (!eventId || !ticketType || !quantity) {
      return res.status(400).json({ message: "Datele sunt incomplete." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }

    const ticket = event.tickets.find((t) => t.type === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: "Tipul de bilet nu este valid." });
    }

    if (ticket.quantity < quantity) {
      return res.status(400).json({ message: "Nu sunt suficiente bilete disponibile." });
    }

    // Scade cantitatea
    ticket.quantity -= quantity;
    await event.save();

    // Creeaza inregistrarea biletului cumparat
    const totalPrice = quantity * ticket.price;
    const newTicket = new Ticket({
      user: req.user.id,
      event: event._id,
      ticketType,
      quantity,
      price: totalPrice,
    });

    await newTicket.save();

    res.status(201).json({ message: "Bilet cumpărat cu succes.", ticket: newTicket });
  } catch (err) {
    console.error("Eroare la cumpărare:", err);
    res.status(500).json({ message: "Eroare server." });
  }
});

//  Doar aceasta ruta GET trebuie sa existe pentru /my
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event");

    const now = new Date();
    const grouped = {
      active: [],
      expired: [],
    };

    tickets.forEach((ticket) => {
      if (ticket.event && ticket.event.date) {
        const isExpired = new Date(ticket.event.date) < now;
        if (isExpired) {
          grouped.expired.push(ticket);
        } else {
          grouped.active.push(ticket);
        }
      }
    });

    res.json(grouped);
  } catch (err) {
    console.error(" Eroare la preluarea biletelor:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
});

module.exports = router;
