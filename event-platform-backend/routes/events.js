const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Event = require('../models/Event');
const upload = require("../middleware/upload");
const fetch = require("node-fetch"); // dacă nu l-ai deja

async function geocodeAddress(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [lon, lat]
  }
  return null;
}


// Crearea unui eveniment nou (acces doar pentru organizatori/admini)
// ✅ Creare eveniment + încărcare imagine
router.post("/", authMiddleware, upload.fields([{ name: "image", maxCount: 1 }]), async (req, res) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acces interzis' });
  }

  const imagePath = req.files?.image?.[0]
    ? `/uploads/events/${req.files.image[0].filename}`
    : null;
    const coords = await geocodeAddress(req.body.location);
    if (!coords) {
      return res.status(400).json({ message: "Locația nu a putut fi geocodată." });
    }
    

  // Extrage biletele din req.body
        let tickets = [];
      try {
        tickets = JSON.parse(req.body.tickets || "[]").map(ticket => ({
          type: ticket.type || "Standard",
          price: Number(ticket.price) || 0,
          quantity: Number(ticket.quantity) || 0,
        }));
      } catch (err) {
        console.error("❌ Eroare la parsarea biletelor:", err);
      }

  
  console.log("📦 Tichete extrase:", tickets);



  try {
    console.log("📦 Tickets trimise:", tickets);
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      date: req.body.date,
      location: {
        address: req.body.location,
        coordinates: coords, // [lon, lat]
      },      
      image: imagePath,
      tickets,
      organizer: req.user.id,
    });
    console.log("✅ Bilete finale salvate:", tickets);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ Eroare la creare eveniment:", err);
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

//Evenimente adaugate recent
router.get("/recent", async (req, res) => {
  try {
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(10);
    res.json(recentEvents);
  } catch (err) {
    res.status(500).json({ message: "Eroare la evenimentele recente" });
  }
});

//Evenimente ce urmeaza curand
router.get("/soon", async (req, res) => {
  try {
    const soonEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(10);
    res.json(soonEvents);
  } catch (err) {
    res.status(500).json({ message: "Eroare la evenimentele în curând" });
  }
});

//Evenimente populare
router.get("/popular", async (req, res) => {
  try {
    const popularEvents = await Event.find()
      .sort({ "tickets.length": -1 }) // sau creezi un alt criteriu
      .limit(10);
    res.json(popularEvents);
  } catch (err) {
    res.status(500).json({ message: "Eroare la evenimentele populare" });
  }
});



// 🔵 Returnează evenimentele organizatorului logat
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea evenimentelor" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const results = await Event.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { "location.address": { $regex: q, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (err) {
    console.error("❌ Eroare la căutare:", err);
    res.status(500).json({ message: "Eroare la căutare" });
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

  

  // Editare eveniment existent
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Evenimentul nu există." });

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nu ai dreptul să editezi acest eveniment." });
    }

    // Actualizăm imaginea dacă a fost încărcată o nouă imagine
    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : event.image;

    // Extragem biletele din FormData
    const tickets = Object.keys(req.body)
      .filter((key) => key.startsWith("tickets["))
      .reduce((acc, key) => {
        const match = key.match(/tickets\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [, index, field] = match;
          acc[index] = acc[index] || {};
          acc[index][field] = req.body[key];
        }
        return acc;
      }, [])
      .map((ticket) => ({
        ...ticket,
        price: Number(ticket.price),
        quantity: Number(ticket.quantity),
      }));

    // Actualizăm câmpurile
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.type = req.body.type || event.type;
    event.date = req.body.date || event.date;
    event.location = { address: req.body.location } || event.location;
    event.image = imagePath;
    event.tickets = tickets;

    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Eroare la editarea evenimentului:", err);
    res.status(500).json({ message: "Eroare server." });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Evenimentul nu există" });

    if (String(event.organizer) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Nu ai permisiunea să ștergi acest eveniment" });
    }

    await event.deleteOne();
    res.json({ message: "Eveniment șters cu succes" });
  } catch (err) {
    console.error("❌ Eroare la ștergere:", err);
    res.status(500).json({ message: "Eroare internă" });
  }
});










module.exports = router;
