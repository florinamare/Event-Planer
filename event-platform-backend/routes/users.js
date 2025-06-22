const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');



// Obține profilul utilizatorului (autentificat)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update-role', authMiddleware, async (req, res) => {
    try {
      const { role } = req.body;
      if (!role) return res.status(400).json({ message: 'Rolul este necesar' });
  
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
  
      user.role = role;
      await user.save();
  
      res.json({ message: 'Rol actualizat cu succes', role: user.role });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ✅ Returnează utilizatorii cu rol pending_organizer
router.get('/pending-organizers', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ role: 'pending_organizer' }).select('-password');
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Aprobare organizator
router.patch('/approve/:id', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'organizer' },
      { new: true }
    ).select('-password');

    res.json({ message: 'Utilizator aprobat', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔄 Update profil cu poză
router.put('/update-profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });

    // Actualizează câmpuri (nume, email, etc. dacă ai)
    if (req.body.name) user.name = req.body.name;

    // 🔄 Actualizează poza dacă a fost trimisă
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profil actualizat cu succes", user });
  } catch (err) {
    res.status(500).json({ message: "Eroare la actualizarea profilului" });
  }
});
  
// ✅ Returnează toți utilizatorii și rolurile lor
router.get('/all', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log("👥 Toți utilizatorii:", users); // Adaugă temporar
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

