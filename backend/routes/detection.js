import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { runDIPPipeline } from '../services/dipService.js';
import {
  saveDetection,
  getDetections,
  getDetectionById,
  deleteDetection,
} from '../services/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const PROCESSED_DIR = path.resolve(__dirname, '../processed');
const SAMPLES_DIR = path.resolve(__dirname, '../uploads/samples');

// Configure multer file upload with format and size validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `upload_${Date.now()}_${uuidv4().substring(0, 8)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedExts.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file format. Only JPG, JPEG, and PNG images are supported.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
});

/**
 * POST /api/detection/analyze
 * Upload and analyze crop image using Digital Image Processing pipeline
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded. Please attach a JPG or PNG image.',
      });
    }

    const { crop_hint = 'auto', part_type = 'leaf' } = req.body;
    const originalImagePath = req.file.path;
    const originalFilename = req.file.filename;

    console.log(`[Detection API] Processing file: ${originalFilename}, crop: ${crop_hint}, part: ${part_type}`);

    // Run the Python DIP Engine
    const dipResult = await runDIPPipeline({
      imagePath: originalImagePath,
      outputDir: PROCESSED_DIR,
      cropHint: crop_hint,
      partType: part_type,
    });

    const detectionRecord = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      original_image: `/uploads/${originalFilename}`,
      crop_name: dipResult.classification?.crop || (crop_hint !== 'auto' ? crop_hint : 'General Crop'),
      disease_detected: dipResult.classification?.disease_name || 'Inconclusive',
      healthy_status: dipResult.classification?.status || 'Unknown',
      part_type,
      crop_hint,
      ...dipResult,
    };

    // Persist in detection history database
    await saveDetection(detectionRecord);

    return res.status(200).json({
      success: true,
      data: detectionRecord,
    });
  } catch (error) {
    console.error('[Detection API Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during digital image processing.',
    });
  }
});

/**
 * POST /api/detection/analyze-sample
 * Analyzes one of the pre-loaded sample images
 */
router.post('/analyze-sample', async (req, res) => {
  try {
    const { sample_filename, crop_hint = 'auto', part_type = 'leaf' } = req.body;

    if (!sample_filename) {
      return res.status(400).json({ success: false, error: 'sample_filename is required.' });
    }

    const samplePath = path.join(SAMPLES_DIR, sample_filename);
    if (!fs.existsSync(samplePath)) {
      return res.status(404).json({ success: false, error: 'Sample image not found on server.' });
    }

    // Copy to uploads dir
    const ext = path.extname(sample_filename);
    const destFilename = `sample_run_${Date.now()}_${uuidv4().substring(0, 6)}${ext}`;
    const destPath = path.join(UPLOADS_DIR, destFilename);
    fs.copyFileSync(samplePath, destPath);

    // Run DIP Pipeline
    const dipResult = await runDIPPipeline({
      imagePath: destPath,
      outputDir: PROCESSED_DIR,
      cropHint: crop_hint,
      partType: part_type,
    });

    const detectionRecord = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      original_image: `/uploads/${destFilename}`,
      crop_name: dipResult.classification?.crop || (crop_hint !== 'auto' ? crop_hint : 'General Crop'),
      disease_detected: dipResult.classification?.disease_name || 'Inconclusive',
      healthy_status: dipResult.classification?.status || 'Unknown',
      part_type,
      crop_hint,
      ...dipResult,
    };

    await saveDetection(detectionRecord);

    return res.status(200).json({
      success: true,
      data: detectionRecord,
    });
  } catch (error) {
    console.error('[Analyze Sample Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing sample image.',
    });
  }
});

/**
 * GET /api/detection/history
 * Retrieve all past detection reports
 */
router.get('/history', async (req, res) => {
  try {
    const { crop, status } = req.query;
    let detections = await getDetections();

    if (crop && crop !== 'all') {
      detections = detections.filter(
        (d) => (d.crop_name || '').toLowerCase() === crop.toLowerCase()
      );
    }

    if (status && status !== 'all') {
      detections = detections.filter(
        (d) => (d.healthy_status || '').toLowerCase() === status.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      count: detections.length,
      data: detections,
    });
  } catch (error) {
    console.error('[Get History Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve detection history.',
    });
  }
});

/**
 * GET /api/detection/:id
 * Retrieve a specific detection report by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const detection = await getDetectionById(id);

    if (!detection) {
      return res.status(404).json({
        success: false,
        error: `Detection report with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: detection,
    });
  } catch (error) {
    console.error('[Get Detection By ID Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch detection record.',
    });
  }
});

/**
 * DELETE /api/detection/:id
 * Delete a detection report
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteDetection(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Detection record '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Detection report deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete detection report.',
    });
  }
});

export default router;
