import express from 'express';
import { getDiseases, getDiseaseById } from '../services/dbService.js';

const router = express.Router();

/**
 * GET /api/diseases
 * List all crop diseases in the knowledge database with search/filter
 */
router.get('/', async (req, res) => {
  try {
    const { crop, query, type } = req.query;
    const diseases = await getDiseases({ crop, query, type });

    return res.status(200).json({
      success: true,
      count: diseases.length,
      data: diseases,
    });
  } catch (error) {
    console.error('[Diseases API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch disease information.',
    });
  }
});

/**
 * GET /api/diseases/:id
 * Retrieve details of a specific disease
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await getDiseaseById(id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: `Disease with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: disease,
    });
  } catch (error) {
    console.error('[Get Disease By ID Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch disease details.',
    });
  }
});

export default router;
