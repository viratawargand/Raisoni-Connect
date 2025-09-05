// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ---------- MONGODB CONNECTION ----------
mongoose
  .connect(
    "mongodb+srv://viratawargand95:RaisoniConnect@cluster0.e3o9mfy.mongodb.net/studentDB?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB connected to Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ---------- FILE STORAGE ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ---------- SCHEMAS ----------
const userSchema = new mongoose.Schema({
  name: String,
  regNo: String,
  email: String,
  mobile: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const studentSchema = new mongoose.Schema(
  { Name: String, "Registration Number": String },
  { strict: false }
);
const CS2125 = mongoose.model("CSstudents21-25", studentSchema, "CSstudents21-25");
const CS2226 = mongoose.model("CSstudents22-26", studentSchema, "CSstudents22-26");
const DS2125 = mongoose.model("DSstudents21-25", studentSchema, "DSstudents21-25");
const DS2226 = mongoose.model("DSstudents22-26", studentSchema, "DSstudents22-26");
const studentCollections = [CS2125, CS2226, DS2125, DS2226];

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    fileUrl: { type: String, default: null }, // store file path if uploaded
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);

// ---------- MIDDLEWARE ----------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ---------- AUTH ROUTES ----------

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, regNo, email, password, confirmPassword, mobile } = req.body;
    if (!firstName || !lastName || !regNo || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const name = `${firstName} ${lastName}1`;

    // whitelist check
    let isWhitelisted = null;
    for (let model of studentCollections) {
      const student = await model.findOne({ "Registration Number": regNo });
      if (student) {
        isWhitelisted = student;
        break;
      }
    }
    if (!isWhitelisted) return res.status(403).json({ message: "Not authorized" });

    const existingUser = await User.findOne({ regNo });
    if (existingUser) return res.status(400).json({ error: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, regNo, email, mobile, password: hashedPassword });
    await newUser.save();

    res.json({ message: "✅ Registration successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { regNo, password } = req.body;
    const user = await User.findOne({ regNo });
    if (!user) return res.status(401).json({ error: "Invalid Registration Number or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid Registration Number or Password" });

    const token = jwt.sign(
      { id: user._id, regNo: user.regNo },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: { id: user._id, name: user.name, regNo: user.regNo, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- FEED / POSTS ----------

// Create Post with optional file upload
app.post("/api/posts", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content && !req.file) return res.status(400).json({ error: "Content or file required" });

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({ userId: req.user.id, content, fileUrl });
    await newPost.save();

    res.json({ message: "✅ Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post", details: error.message });
  }
});

// Get Posts
app.get("/api/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name regNo email")
      .populate("comments.userId", "name regNo")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
});

// Like Post
app.post("/api/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "✅ Like updated", likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to like post", details: error.message });
  }
});

// Comment Post
app.post("/api/posts/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ userId: req.user.id, text });
    await post.save();

    res.json({ message: "✅ Comment added", comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to comment", details: error.message });
  }
});

// ---------- START SERVER ----------
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
