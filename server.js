require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://harshikaa7:harshika@patholab.ngt6t.mongodb.net/pathotab?retryWrites=true&w=majority";

// ✅ Middleware
app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Log HTTP requests

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Mongoose Schema & Model
const DonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", DonationSchema);

// ✅ API Route to Handle Form Submission
app.post("/schedule", async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    const savedDonation = await newDonation.save();
    console.log("✅ Data Saved:", savedDonation);

    res.status(201).json({
      message: "✅ Donation Scheduled Successfully!",
      data: savedDonation,
    });
  } catch (error) {
    console.error("❌ Error saving donation:", error);
    res.status(500).json({ message: "❌ Error scheduling donation", error: error.message });
  }
});

// ✅ API Route to Retrieve All Donations
app.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "❌ Error retrieving data", error: error.message });
  }
});




// ✅ Root Route (For Testing)
app.get("/", (req, res) => {
  res.send("🚀 Blood Bank API Running...");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});