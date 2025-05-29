const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000; // ✅ Use Render port

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON request body

// MongoDB connection URI
const mongoUri = "mongodb+srv://anilkumar:9392832240@cluster0.guvwb.mongodb.net/?retryWrites=true&w=majority";

// Database and collection variables
let after10thCollection;

async function connectDB() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db('quiz_app');
    after10thCollection = db.collection('after10th_users');
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// 🔁 GET route to check API health
app.get("/", (req, res) => {
  res.send("🎉 API is working! Express server is live.");
});

// POST route to receive form data
app.post('/api/submit_after10th', async (req, res) => {
  try {
    const formData = req.body;

    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.interest) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const result = await after10thCollection.insertOne(formData);
    res.status(201).json({ message: "Form submitted successfully", id: result.insertedId });

  } catch (error) {
    console.error("❌ Error inserting document:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
});
