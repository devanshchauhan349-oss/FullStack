const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// In-memory seat storage (10 seats)
let seats = Array(10).fill(false);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.get("/seats", (req, res) => {
  const seatStatus = seats.map((booked, index) => ({
    seatNumber: index + 1,
    status: booked ? "Booked" : "Available"
  }));
  res.json(seatStatus);
});

app.post("/book", (req, res) => {
  const { seatNumber } = req.body;
  if (!seatNumber || seatNumber < 1 || seatNumber > seats.length) {
    return res.status(400).json({ message: "Invalid seat number" });
  }
  if (seats[seatNumber - 1]) {
    return res.status(400).json({ message: `Seat ${seatNumber} is already booked` });
  }
  seats[seatNumber - 1] = true;
  res.json({ message: `✅ Seat ${seatNumber} booked successfully!` });
});

app.post("/cancel", (req, res) => {
  const { seatNumber } = req.body;
  if (!seatNumber || seatNumber < 1 || seatNumber > seats.length) {
    return res.status(400).json({ message: "Invalid seat number" });
  }
  if (!seats[seatNumber - 1]) {
    return res.status(400).json({ message: `Seat ${seatNumber} is not booked` });
  }
  seats[seatNumber - 1] = false;
  res.json({ message: `❌ Seat ${seatNumber} cancelled successfully!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Seat booking server running on http://localhost:${PORT}`);
});