import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';             // Security Headers
import compression from 'compression';   //  Gzip Compression
import cookieParser from 'cookie-parser';// For handling JWT cookies
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---  PRODUCTION MIDDLEWARE START ---

// 1. Security Headers
// crossOriginResourcePolicy: "cross-origin" allows your frontend to load images from /uploads
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

// 2. Compression (Faster responses)
app.use(compression());

// 3. Cookie Parser (Required for your JWT HttpOnly Cookies)
app.use(cookieParser());

// 4. CORS Configuration
// This dynamically allows your Vercel frontend or Localhost
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true // Allow cookies to be sent
}));

// --- 🛡️ PRODUCTION MIDDLEWARE END ---

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Health Check Route (Required for Task 5)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', mode: process.env.NODE_ENV });
});

// Test route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error handlers (keep at the bottom)
app.use(notFound);
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});