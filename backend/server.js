import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import detectionRoutes from './routes/detection.js';
import diseasesRoutes from './routes/diseases.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure directories exist
const uploadDir = path.resolve(__dirname, 'uploads');
const processedDir = path.resolve(__dirname, 'processed');
const dataDir = path.resolve(__dirname, 'data');
[uploadDir, processedDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static files serving
app.use('/uploads', express.static(uploadDir));
app.use('/processed', express.static(processedDir));

// API Routes
app.use('/api/detection', detectionRoutes);
app.use('/api/diseases', diseasesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', statsRoutes); // mounts /api/samples

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AgriVision Crop Disease Detection API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🌱 Crop Disease Detection Server running on port ${PORT}`);
  console.log(` 📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(` 🖼️  Uploads served at: http://localhost:${PORT}/uploads`);
  console.log(` 🔬 Processed artifacts at: http://localhost:${PORT}/processed`);
  console.log(`====================================================`);
});
