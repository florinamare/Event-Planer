const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Event = require('../models/Event');


// Crearea unui eveniment nou (acces doar pentru organizatori/admini)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acces interzis' });
  }

  const { title, description, type, date, location, tickets } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      type,
      date,
      location,
      organizer: req.user.id,
      tickets
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listarea evenimentelor
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Obține un eveniment după ID
router.get("/:id", async (req, res) => {
    try {
      console.log("🔹 Cerere GET pentru eveniment ID:", req.params.id);
      
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Evenimentul nu a fost găsit" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Eroare la căutarea evenimentului" });
    }
  });
  

module.exports = router;
