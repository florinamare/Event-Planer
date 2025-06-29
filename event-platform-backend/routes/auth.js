const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secretkey';

// Ruta de înregistrare

// Inregistrare utilizator
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Acest email este deja folosit." });
    }

    // Setam rolul doar dacă e permis
    let finalRole = "user";
    if (role === "pending_organizer") {
      finalRole = "pending_organizer";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    await user.save();

    res.status(201).json({
      message: "Utilizator înregistrat cu succes!",
      info:
        finalRole === "pending_organizer"
          ? "Cererea ta de organizator va fi aprobată de un administrator."
          : undefined,
    });
  } catch (err) {
    console.error("Eroare la înregistrare:", err);
    res.status(500).json({ message: "Eroare la înregistrare" });
  }
});


// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credențiale invalide' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credențiale invalide' });

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
