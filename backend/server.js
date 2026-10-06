const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Scholarship Finder backend is running!"
  });
});

app.post("/api/profile", (req, res) => {
  const profile = req.body;

  res.json({
    success: true,
    message: "Profile received successfully!",
    profile: profile
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});