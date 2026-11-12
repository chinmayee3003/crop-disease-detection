import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DETECTIONS_FILE = path.join(DATA_DIR, 'detections.json');
const DISEASES_FILE = path.join(DATA_DIR, 'diseases.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure detections file exists
if (!fs.existsSync(DETECTIONS_FILE)) {
  fs.writeFileSync(DETECTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

/**
 * Reads detections from JSON file
 */
export const getDetections = async () => {
  try {
    const raw = fs.readFileSync(DETECTIONS_FILE, 'utf-8');
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error('Error reading detections database:', err);
    return [];
  }
};

/**
 * Gets detection by ID
 */
export const getDetectionById = async (id) => {
  const detections = await getDetections();
  return detections.find((d) => d.id === id || d.metadata?.image_id === id) || null;
};

/**
 * Saves a new detection record
 */
export const saveDetection = async (detection) => {
  const detections = await getDetections();
  detections.unshift(detection); // most recent first
  fs.writeFileSync(DETECTIONS_FILE, JSON.stringify(detections, null, 2), 'utf-8');
  return detection;
};

/**
 * Deletes detection by ID
 */
export const deleteDetection = async (id) => {
  const detections = await getDetections();
  const index = detections.findIndex((d) => d.id === id);
  if (index === -1) return false;
  const deleted = detections.splice(index, 1)[0];
  fs.writeFileSync(DETECTIONS_FILE, JSON.stringify(detections, null, 2), 'utf-8');
  return deleted;
};

/**
 * Reads all disease catalog entries
 */
export const getDiseases = async ({ crop, query, type } = {}) => {
  try {
    if (!fs.existsSync(DISEASES_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DISEASES_FILE, 'utf-8');
    let diseases = JSON.parse(raw);

    if (crop && crop !== 'all') {
      diseases = diseases.filter((d) =>
        d.crop.toLowerCase().includes(crop.toLowerCase())
      );
    }

    if (type && type !== 'all') {
      diseases = diseases.filter((d) =>
        (d.type || 'leaf').toLowerCase() === type.toLowerCase()
      );
    }

    if (query) {
      const q = query.toLowerCase();
      diseases = diseases.filter(
        (d) =>
          d.disease_name.toLowerCase().includes(q) ||
          d.crop.toLowerCase().includes(q) ||
          d.pathogen.toLowerCase().includes(q) ||
          (d.symptoms && d.symptoms.some((s) => s.toLowerCase().includes(q)))
      );
    }

    return diseases;
  } catch (err) {
    console.error('Error reading diseases database:', err);
    return [];
  }
};

/**
 * Gets disease by ID
 */
export const getDiseaseById = async (id) => {
  const diseases = await getDiseases();
  return diseases.find((d) => d.id === id) || null;
};

/**
 * Calculates global application statistics
 */
export const getStats = async () => {
  const detections = await getDetections();
  const diseases = await getDiseases();

  const totalDetections = detections.length;
  const infectedCount = detections.filter(
    (d) => d.classification?.status === 'Infected'
  ).length;
  const healthyCount = detections.filter(
    (d) => d.classification?.status === 'Healthy'
  ).length;

  const totalAffectedSum = detections.reduce(
    (sum, d) => sum + (d.classification?.affected_area_percentage || 0),
    0
  );
  const avgAffectedPercentage =
    totalDetections > 0 ? (totalAffectedSum / totalDetections).toFixed(1) : 0;

  // Disease frequency counts
  const diseaseCounts = {};
  const cropCounts = {};

  detections.forEach((d) => {
    const dName = d.classification?.disease_name || 'Unknown';
    diseaseCounts[dName] = (diseaseCounts[dName] || 0) + 1;

    const cName = d.classification?.crop || 'General';
    cropCounts[cName] = (cropCounts[cName] || 0) + 1;
  });

  const topDiseases = Object.entries(diseaseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const cropDistribution = Object.entries(cropCounts).map(([crop, count]) => ({
    crop,
    count,
  }));

  return {
    totalDetections,
    infectedCount,
    healthyCount,
    healthyRate:
      totalDetections > 0
        ? Math.round((healthyCount / totalDetections) * 100)
        : 100,
    avgAffectedPercentage: parseFloat(avgAffectedPercentage),
    catalogedDiseasesCount: diseases.length,
    topDiseases,
    cropDistribution,
    recentDetections: detections.slice(0, 5),
  };
};
