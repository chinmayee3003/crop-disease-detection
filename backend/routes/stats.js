import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getStats } from '../services/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const SAMPLES_DIR = path.resolve(__dirname, '../uploads/samples');

/**
 * GET /api/stats
 * Dashboard metrics, summary numbers, and recent scans
 */
router.get('/', async (req, res) => {
  try {
    const stats = await getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('[Stats API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate statistics.',
    });
  }
});

/**
 * GET /api/samples
 * Returns list of pre-configured sample crop images
 */
router.get('/samples', (req, res) => {
  try {
    if (!fs.existsSync(SAMPLES_DIR)) {
      return res.status(200).json({ success: true, samples: [] });
    }

    const files = fs.readdirSync(SAMPLES_DIR).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));

    const sampleMetadata = {
      'sample_tomato_early_blight.jpg': {
        title: 'Tomato Early Blight',
        crop: 'Tomato',
        part: 'leaf',
        description: 'Leaf exhibiting concentric target rings with yellow chlorotic margin.',
      },
      'sample_tomato_late_blight.jpg': {
        title: 'Tomato Late Blight',
        crop: 'Tomato',
        part: 'leaf',
        description: 'Irregular water-soaked necrotic patches with margin collapse.',
      },
      'sample_corn_rust.jpg': {
        title: 'Corn Common Rust',
        crop: 'Corn (Maize)',
        part: 'leaf',
        description: 'Dense cinnamon-brown pustules erupting across leaf surface.',
      },
      'sample_apple_scab.jpg': {
        title: 'Apple Scab',
        crop: 'Apple',
        part: 'leaf',
        description: 'Velvety dark olive-brown circular scab spots.',
      },
      'sample_healthy_tomato.jpg': {
        title: 'Healthy Tomato Leaf',
        crop: 'Tomato',
        part: 'leaf',
        description: 'Lush, uniform emerald green foliage free from lesions.',
      },
      'sample_root_rot.jpg': {
        title: 'Root Rot / Vascular Necrosis',
        crop: 'General Crops',
        part: 'root',
        description: 'Decayed, blackened root core with cortical sloughing.',
      },
    };

    const samples = files.map((file) => ({
      filename: file,
      url: `/uploads/samples/${file}`,
      ...(sampleMetadata[file] || {
        title: file.replace('.jpg', '').replace('sample_', '').replace(/_/g, ' '),
        crop: 'Crop',
        part: 'leaf',
        description: 'Sample test image',
      }),
    }));

    return res.status(200).json({
      success: true,
      data: samples,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to list sample images.' });
  }
});

export default router;
