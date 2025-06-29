const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Încarcă variabilele din .env

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const ticketRoutes = require("./routes/tickets");
const cartRoutes = require("./routes/cart");

require('./models/Ticket');
require('./models/Cart');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(" Express inițializat...");

// 🛠️ Activează CORS pentru frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.json());

console.log(" Se încearcă conectarea la MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB conectat cu succes!");

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/uploads', express.static('uploads'));
    app.use("/api/tickets", ticketRoutes);
    app.use("/api/cart", cartRoutes);

    app.listen(PORT, () => {
      console.log(` Serverul rulează pe http://localhost:${PORT}`);
    });

  })
  .catch(err => {
    console.error(" Eroare la conectarea MongoDB:", err);
    process.exit(1);
  });
