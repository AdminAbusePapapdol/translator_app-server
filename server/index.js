// 1. Imports
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

// 2. App & middleware
const app = express();
app.use(cors());
app.use(express.json());

// 3. Health-check route
app.get("/", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// 4. MongoDB setup
const uri = process.env.MONGO_URI;
console.log("🔌 MONGO_URI:", uri);
const client = new MongoClient(uri);

// 5. Feedback route
app.post("/feedback", async (req, res) => {
  console.log("📥 Received:", req.body);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const coll = client.db("myAppFeedback").collection("feedback");
    const result = await coll.insertOne(req.body);
    console.log("📝 InsertedId:", result.insertedId);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Insert Error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

// 6. Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
