import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { fetchAssets } from "./services/scrapingService.js";
import { generateImage } from "./services/imageService.js";
import authRoutes from "./routes/auth.js";
import { PORT, MONGO_URI } from "./config.js";
import rateLimit from "express-rate-limit";
import logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => logger.info("Connected to MongoDB"));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", apiLimiter);

// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Static Files
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// Routes
app.use("/auth", authRoutes);
app.get("/api/fetch-assets", fetchAssets);
app.post("/api/generate-image", generateImage);

// Serve React App
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("Server is running.");
    }
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Force HTTPS in Production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
