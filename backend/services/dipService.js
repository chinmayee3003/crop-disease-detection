import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find virtual environment python or system python
const findPython = () => {
  const venvPython = path.resolve(__dirname, '../../venv/bin/python3');
  if (fs.existsSync(venvPython)) {
    return venvPython;
  }
  const altVenvPython = path.resolve(__dirname, '../venv/bin/python3');
  if (fs.existsSync(altVenvPython)) {
    return altVenvPython;
  }
  return 'python3';
};

/**
 * Executes the Python DIP Engine for an uploaded crop image.
 */
export const runDIPPipeline = ({ imagePath, outputDir, cropHint = 'auto', partType = 'leaf' }) => {
  return new Promise((resolve, reject) => {
    const pythonBin = findPython();
    const scriptPath = path.resolve(__dirname, '../python/dip_engine.py');

    const args = [
      scriptPath,
      '--image', imagePath,
      '--output_dir', outputDir,
      '--crop_hint', cropHint,
      '--part_type', partType,
    ];

    console.log(`[DIP Service] Spawning Python pipeline: ${pythonBin} ${args.join(' ')}`);

    const pyProcess = spawn(pythonBin, args, {
      cwd: path.resolve(__dirname, '../python'),
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('[DIP Service] Python script stderr:', stderrData);
        try {
          const parsed = JSON.parse(stdoutData);
          if (parsed.error) {
            return reject(new Error(parsed.error));
          }
        } catch (_) {}
        return reject(new Error(`DIP Engine execution failed with exit code ${code}: ${stderrData || stdoutData}`));
      }

      try {
        const parsed = JSON.parse(stdoutData);
        if (!parsed.success) {
          return reject(new Error(parsed.error || 'DIP pipeline returned failure'));
        }
        resolve(parsed.data);
      } catch (err) {
        console.error('[DIP Service] JSON parse error of Python output:', stdoutData);
        reject(new Error(`Failed to parse DIP pipeline JSON output: ${err.message}`));
      }
    });

    pyProcess.on('error', (err) => {
      console.error('[DIP Service] Failed to spawn Python process:', err);
      reject(new Error(`Unable to execute Python process: ${err.message}`));
    });
  });
};
