// server/server.js
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const Employee = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 2. Register endpoint
app.post("/register", async (req, res) => {
  try {
    const user = await Employee.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.json({ status: "Error", message: "No record found" });
    if (user.password !== password)
      return res.json({ status: "Error", message: "Incorrect password" });
    res.json({ status: "Success", user });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// 4. Start
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
