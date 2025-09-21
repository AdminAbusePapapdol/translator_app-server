// 1. Imports
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const Joi = require("joi");

// 2. App & middleware
const app = express();
app.use(cors());
app.use(express.json());

// 3. Health-check route
app.get("/", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// 4. MongoDB setup
const uri = process.env.MONGO_URI.trim();
const client = new MongoClient(uri);

// 5. Validation schema
const feedbackSchema = Joi.object({
  experience: Joi.string().required(),
  featureUsed: Joi.string().required(),
  accuracyRatings: Joi.object({
    sbToEn: Joi.number().min(1).max(5).required(),
    enToSb: Joi.number().min(1).max(5).required(),
    sbToTl: Joi.number().min(1).max(5).required()
  }).required(),
  voiceInput: Joi.string().valid("Yes","No").required(),
  technicalIssue: Joi.string().allow(""),
  futureFeatures: Joi.string().allow(""),
  additionalComments: Joi.string().allow("")
});

// 6. Feedback route with API-key check & validation
app.post("/feedback", async (req, res) => {
  // 6a. API Key authorization
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  // 6b. Validate payload
  const { error, value } = feedbackSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, error: messages });
  }

  // 6c. Insert into MongoDB
  try {
    await client.connect();
    const coll = client.db("myAppFeedback").collection("feedback");
    const result = await coll.insertOne(value);
    return res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("❌ Insert Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.close();
  }
});

// 7. Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
