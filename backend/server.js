const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();
const CryptoJS = require("crypto-js");

// Load Firebase Admin SDK credentials
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔒 Middleware to Verify Firebase Token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token", error });
  }
};

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 🔹 Define MongoDB Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  userId: String, // Store Firebase UID
});

const Contact = mongoose.model("contactDetails", contactSchema);

// 🔒 Protected Contact Form Submission
app.post("/api/contact", verifyToken, async (req, res) => {
  try {
    const { encryptedData } = req.body;

    // Decrypt Received Data
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { name, email, phone, message } = decryptedData;

    // Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
      userId: req.user.uid, // Attach Firebase User ID
    });

    await newContact.save();
    res.status(201).json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// 🔒 Protected Test Route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ success: true, message: "This is a protected route", user: req.user });
});

// 🌍 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
