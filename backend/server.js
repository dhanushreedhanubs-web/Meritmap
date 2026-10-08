const Profile = require("./models/Profile");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const searchRoutes = require("./routes/searchRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", searchRoutes);
app.use("/api", scholarshipRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Scholarship Finder backend is running!"
  });
});

app.post("/api/profile", async (req, res) => {
  try {
    const profile = new Profile(req.body);

    const savedProfile = await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile saved successfully",
      profile: savedProfile
    });
  } catch (error) {
    console.error("Profile save failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save profile"
    });
  }
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

