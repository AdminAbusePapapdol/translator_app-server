const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// Pull your Atlas URI from Env var
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.post("/feedback", async (req, res) => {
  try {
    await client.connect();
    const coll = client.db("myAppFeedback").collection("feedback");
    const result = await coll.insertOne(req.body);
    res.json({ success: result.insertedId != null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
