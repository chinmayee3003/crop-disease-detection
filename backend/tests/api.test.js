/**
 * Automated Test Suite for Crop Disease Detection Backend APIs and DIP Engine
 */

import http from 'http';

const BASE_URL = 'http://localhost:5001';

const fetchJson = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting AgriVision DIP API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(` ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    // Test 1: Health check
    const health = await fetchJson(`${BASE_URL}/api/health`);
    assert(health.status === 200 && health.data.status === 'online', 'Health endpoint /api/health');

    // Test 2: Disease encyclopedia
    const diseases = await fetchJson(`${BASE_URL}/api/diseases`);
    assert(diseases.status === 200 && diseases.data.count >= 20, 'Disease list /api/diseases returns 20+ profiles');

    // Test 3: Specific disease details
    const disease = await fetchJson(`${BASE_URL}/api/diseases/tomato_early_blight`);
    assert(disease.status === 200 && disease.data.data.crop === 'Tomato', 'Specific disease details /api/diseases/:id');

    // Test 4: Stats overview
    const stats = await fetchJson(`${BASE_URL}/api/stats`);
    assert(stats.status === 200 && stats.data.data.catalogedDiseasesCount >= 20, 'Stats endpoint /api/stats');

    // Test 5: Sample crop library
    const samples = await fetchJson(`${BASE_URL}/api/samples`);
    assert(samples.status === 200 && samples.data.data.length >= 4, 'Sample crop images /api/samples');

    // Test 6: Analyze Sample Image via DIP Pipeline
    console.log('\n 🔬 Executing Python DIP Pipeline via /api/detection/analyze-sample...');
    const analyzePayload = JSON.stringify({
      sample_filename: 'sample_tomato_early_blight.jpg',
      crop_hint: 'tomato',
      part_type: 'leaf',
    });

    const analysis = await fetchJson(`${BASE_URL}/api/detection/analyze-sample`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(analyzePayload),
      },
      body: analyzePayload,
    });

    assert(analysis.status === 200 && analysis.data.success === true, 'Analyze sample execution success');
    const record = analysis.data.data;
    assert(record.stages && record.stages.length === 8, '8 DIP stages generated in response');
    assert(record.visual_artifacts && record.visual_artifacts.affected_regions, 'Visual artifacts generated');
    assert(typeof record.classification.affected_area_percentage === 'number', 'Affected area percentage computed');
    assert(record.classification.confidence > 0, 'Mathematical confidence score provided');

    // Test 7: History persistence
    const history = await fetchJson(`${BASE_URL}/api/detection/history`);
    assert(history.status === 200 && history.data.data.length > 0, 'History log persistence /api/detection/history');

    // Test 8: Get detection by ID
    const singleDetection = await fetchJson(`${BASE_URL}/api/detection/${record.id}`);
    assert(singleDetection.status === 200 && singleDetection.data.data.id === record.id, 'Fetch detection by ID /api/detection/:id');

    console.log(`\n========================================`);
    console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
