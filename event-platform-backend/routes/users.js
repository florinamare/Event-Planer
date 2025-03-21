const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

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
  
module.exports = router;
