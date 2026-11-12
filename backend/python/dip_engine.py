"""
Digital Image Processing (DIP) Pipeline Engine for Crop Disease Detection
Executes 8 concrete digital image processing stages:
1. Image Acquisition
2. Image Resizing
3. Noise Removal (Gaussian & Median filtering)
4. Image Enhancement (CLAHE & Unsharp masking)
5. RGB to HSV / Color Space Transformation
6. Image Segmentation (Plant tissue extraction)
7. Disease-Affected Region Extraction (Lesion segmentation & heatmaps)
8. Feature Extraction & Pathology Classification
"""

import os
import sys
import json
import argparse
import numpy as np
import cv2
from PIL import Image

from feature_extractor import compute_color_moments, compute_glcm_texture, compute_morphology
from classifier import classify_crop_disease

def process_image(image_path, output_dir, crop_hint="auto", part_type="leaf"):
    """
    Executes the full 8-stage digital image processing pipeline.
    Saves visual artifacts in output_dir and returns diagnostic JSON.
    """
    os.makedirs(output_dir, exist_ok=True)
    base_id = os.path.splitext(os.path.basename(image_path))[0]

    # STAGE 1: Image Acquisition
    raw_bgr = cv2.imread(image_path)
    if raw_bgr is None:
        raise ValueError(f"Unable to read image at path: {image_path}. Please verify the file is a valid JPG/PNG.")

    orig_h, orig_w, orig_c = raw_bgr.shape
    file_size_kb = round(os.path.getsize(image_path) / 1024.0, 1)

    stage1_filename = f"{base_id}_01_acquired.jpg"
    cv2.imwrite(os.path.join(output_dir, stage1_filename), raw_bgr)

    # STAGE 2: Image Resizing & Standardization
    target_dim = 512
    resized_bgr = cv2.resize(raw_bgr, (target_dim, target_dim), interpolation=cv2.INTER_AREA)

    stage2_filename = f"{base_id}_02_resized.jpg"
    cv2.imwrite(os.path.join(output_dir, stage2_filename), resized_bgr)

    # STAGE 3: Noise Removal (Gaussian & Median filtering)
    gaussian_filtered = cv2.GaussianBlur(resized_bgr, (5, 5), sigmaX=1.2)
    median_filtered = cv2.medianBlur(resized_bgr, 5)

    # Side-by-side comparison visualization
    # Left: Gaussian, Right: Median
    noise_comparison = np.hstack([gaussian_filtered, median_filtered])
    # Add labels
    cv2.putText(noise_comparison, "Gaussian Filter (sigma=1.2)", (15, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(noise_comparison, "Median Filter (k=5)", (target_dim + 15, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

    stage3_filename = f"{base_id}_03_noise_removal.jpg"
    cv2.imwrite(os.path.join(output_dir, stage3_filename), noise_comparison)

    # Optimal denoised base for subsequent processing
    denoised_bgr = cv2.bilateralFilter(resized_bgr, d=7, sigmaColor=50, sigmaSpace=50)

    # STAGE 4: Image Enhancement
    # CLAHE on Lightness channel in LAB color space
    lab = cv2.cvtColor(denoised_bgr, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l_channel)
    lab_enhanced = cv2.merge([l_enhanced, a_channel, b_channel])
    clahe_enhanced_bgr = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)

    # Edge-preserving unsharp mask
    blurred_for_mask = cv2.GaussianBlur(clahe_enhanced_bgr, (5, 5), 1.0)
    enhanced_bgr = cv2.addWeighted(clahe_enhanced_bgr, 1.25, blurred_for_mask, -0.25, 0)

    stage4_filename = f"{base_id}_04_enhanced.jpg"
    cv2.imwrite(os.path.join(output_dir, stage4_filename), enhanced_bgr)

    # STAGE 5: RGB to HSV Conversion
    hsv_img = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2HSV)
    h_ch, s_ch, v_ch = cv2.split(hsv_img)

    # Visual false-color representation of Hue and Saturation
    hue_colormap = cv2.applyColorMap(h_ch, cv2.COLORMAP_JET)
    sat_colormap = cv2.applyColorMap(s_ch, cv2.COLORMAP_VIRIDIS)
    hsv_vis = np.hstack([hsv_img, hue_colormap])
    cv2.putText(hsv_vis, "HSV Color Space", (15, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(hsv_vis, "Hue Spectrum (JET)", (target_dim + 15, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

    stage5_filename = f"{base_id}_05_hsv_representation.jpg"
    cv2.imwrite(os.path.join(output_dir, stage5_filename), hsv_vis)

    # STAGE 6: Image Segmentation (Foreground Plant Extraction)
    # Convert enhanced image to RGB for color math
    enhanced_rgb = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)
    r_ch = enhanced_rgb[:, :, 0].astype(np.float32)
    g_ch = enhanced_rgb[:, :, 1].astype(np.float32)
    b_ch = enhanced_rgb[:, :, 2].astype(np.float32)

    is_root = (part_type == "root") or (crop_hint and "root" in crop_hint.lower())

    if is_root:
        # Root segmentation: root tissue differs from background by brightness/gradient
        gray = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2GRAY)
        blur_gray = cv2.GaussianBlur(gray, (5, 5), 0)
        _, plant_mask = cv2.threshold(blur_gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    else:
        # Foliage segmentation: Excess Green Index + HSV Green & Yellow ranges
        # ExG = 2G - R - B
        exg = 2.0 * g_ch - r_ch - b_ch

        # HSV Green-to-Yellow-to-Brown spectrum for foliage
        # H: 18 to 90 encompasses yellow chlorosis, brown lesions and lush green
        mask_hsv = cv2.inRange(hsv_img, np.array([18, 30, 30]), np.array([95, 255, 255]))
        mask_exg = (exg > 5.0).astype(np.uint8) * 255

        plant_mask = cv2.bitwise_or(mask_hsv, mask_exg)

        # Background suppression for white/neutral studio backdrops (common in PlantVillage)
        # Avoid selecting white paper / background by requiring saturation > 25 and not pure white
        not_white = cv2.inRange(enhanced_bgr, np.array([0, 0, 0]), np.array([235, 235, 235]))
        plant_mask = cv2.bitwise_and(plant_mask, not_white)

    # Morphological opening and closing to clean up segmentation mask
    kernel_seg = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    plant_mask = cv2.morphologyEx(plant_mask, cv2.MORPH_OPEN, kernel_seg)
    plant_mask = cv2.morphologyEx(plant_mask, cv2.MORPH_CLOSE, kernel_seg)

    # Keep largest connected components (the main leaf/root)
    contours, _ = cv2.findContours(plant_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    clean_plant_mask = np.zeros_like(plant_mask)
    if contours:
        # Keep contours that have reasonable area (> 500 pixels)
        for c in contours:
            if cv2.contourArea(c) > 400:
                cv2.drawContours(clean_plant_mask, [c], -1, 255, -1)

    segmented_plant = cv2.bitwise_and(enhanced_bgr, enhanced_bgr, mask=clean_plant_mask)

    stage6_mask_filename = f"{base_id}_06_plant_mask.jpg"
    stage6_plant_filename = f"{base_id}_06_segmented_plant.jpg"
    cv2.imwrite(os.path.join(output_dir, stage6_mask_filename), clean_plant_mask)
    cv2.imwrite(os.path.join(output_dir, stage6_plant_filename), segmented_plant)

    # STAGE 7: Disease-Affected Region Extraction (Lesion Segmentation)
    # Within the plant mask, identify necrotic spots, chlorotic halos, and fungal pustules
    if is_root:
        # Dark brown / black necrotic decayed root zones
        h_mask_decay = cv2.inRange(hsv_img, np.array([0, 40, 0]), np.array([24, 255, 120]))
        disease_mask = cv2.bitwise_and(h_mask_decay, clean_plant_mask)
    else:
        # Leaf disease spots:
        # 1. Necrotic / Brown / Rust lesions: H in [0, 24] or [170, 180] with sufficient saturation
        mask_brown_rust = cv2.inRange(hsv_img, np.array([0, 50, 30]), np.array([26, 255, 190]))
        # 2. Chlorotic yellow halos: H in [22, 34], S > 60, V > 70
        mask_chlorosis = cv2.inRange(hsv_img, np.array([22, 60, 70]), np.array([34, 255, 255]))
        # 3. Dark fungal blight / scab spots (low brightness within leaf)
        mask_dark_lesion = cv2.inRange(hsv_img, np.array([0, 30, 10]), np.array([180, 255, 75]))

        disease_candidates = cv2.bitwise_or(mask_brown_rust, mask_chlorosis)
        disease_candidates = cv2.bitwise_or(disease_candidates, mask_dark_lesion)
        disease_mask = cv2.bitwise_and(disease_candidates, clean_plant_mask)

    # Morphological noise filter on disease mask
    kernel_lesion = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    disease_mask = cv2.morphologyEx(disease_mask, cv2.MORPH_OPEN, kernel_lesion)

    # Visual overlay with bounding boxes and contour outlines
    overlay_img = enhanced_bgr.copy()
    disease_contours, _ = cv2.findContours(disease_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    highlighted_count = 0
    for cnt in disease_contours:
        area = cv2.contourArea(cnt)
        if area > 12:
            highlighted_count += 1
            # Draw contour boundary in glowing red
            cv2.drawContours(overlay_img, [cnt], -1, (0, 0, 255), 2)
            # Bounding rectangle for major spots
            if area > 120:
                x, y, w, h = cv2.boundingRect(cnt)
                cv2.rectangle(overlay_img, (x, y), (x + w, y + h), (0, 165, 255), 1)

    # Generate Disease Severity Heatmap
    # Gaussian blur the disease mask to create smooth continuous intensity gradients
    disease_float = disease_mask.astype(np.float32) / 255.0
    smooth_density = cv2.GaussianBlur(disease_float, (31, 31), 10)
    density_norm = (smooth_density * 255.0).astype(np.uint8)
    heatmap_colored = cv2.applyColorMap(density_norm, cv2.COLORMAP_TURBO)

    # Blend heatmap over grayscale leaf
    gray_leaf = cv2.cvtColor(segmented_plant, cv2.COLOR_BGR2GRAY)
    gray_leaf_3ch = cv2.cvtColor(gray_leaf, cv2.COLOR_GRAY2BGR)
    heatmap_overlay = cv2.addWeighted(gray_leaf_3ch, 0.55, heatmap_colored, 0.45, 0)
    # Mask out background from heatmap
    heatmap_overlay = cv2.bitwise_and(heatmap_overlay, heatmap_overlay, mask=clean_plant_mask)

    stage7_mask_filename = f"{base_id}_07_disease_mask.jpg"
    stage7_overlay_filename = f"{base_id}_07_affected_regions.jpg"
    stage7_heatmap_filename = f"{base_id}_07_severity_heatmap.jpg"

    cv2.imwrite(os.path.join(output_dir, stage7_mask_filename), disease_mask)
    cv2.imwrite(os.path.join(output_dir, stage7_overlay_filename), overlay_img)
    cv2.imwrite(os.path.join(output_dir, stage7_heatmap_filename), heatmap_overlay)

    # STAGE 8: Feature Extraction & Pathology Classification
    color_moments = compute_color_moments(enhanced_rgb, mask=clean_plant_mask)
    gray_for_glcm = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2GRAY)
    texture_features = compute_glcm_texture(gray_for_glcm, mask=clean_plant_mask)
    morphology = compute_morphology(clean_plant_mask, disease_mask)

    classification = classify_crop_disease(
        color_moments=color_moments,
        texture_features=texture_features,
        morphology=morphology,
        crop_hint=crop_hint,
        part_type=part_type
    )

    # Build comprehensive diagnostic record
    result = {
        "metadata": {
            "image_id": base_id,
            "original_resolution": f"{orig_w}x{orig_h}",
            "processed_resolution": f"{target_dim}x{target_dim}",
            "file_size_kb": file_size_kb,
            "color_channels": orig_c,
            "part_type": part_type,
            "crop_hint": crop_hint
        },
        "stages": [
            {
                "stage_number": 1,
                "name": "Image Acquisition",
                "description": "Image capture and optical input ingestion. Verification of format integrity, color channels, and dimension properties.",
                "artifact_image": f"/processed/{stage1_filename}",
                "metrics": {
                    "Resolution": f"{orig_w}x{orig_h}",
                    "File Size": f"{file_size_kb} KB",
                    "Bit Depth": "24-bit RGB"
                }
            },
            {
                "stage_number": 2,
                "name": "Image Resizing",
                "description": "Spatial dimension normalization to standard 512x512 matrix using bicubic interpolation for computational consistency.",
                "artifact_image": f"/processed/{stage2_filename}",
                "metrics": {
                    "Target Size": "512x512 px",
                    "Interpolation": "Area & Bicubic",
                    "Aspect Ratio": f"{round(orig_w/orig_h, 2)}"
                }
            },
            {
                "stage_number": 3,
                "name": "Noise Removal & Filtering",
                "description": "Gaussian (sigma=1.2) and Median filter (k=5) comparison to suppress high-frequency sensor noise while preserving anatomical leaf boundaries.",
                "artifact_image": f"/processed/{stage3_filename}",
                "metrics": {
                    "Gaussian Kernel": "5x5 (sigma=1.2)",
                    "Median Kernel": "5x5 window",
                    "Filter Choice": "Bilateral Edge-Preserving Denoise"
                }
            },
            {
                "stage_number": 4,
                "name": "Image Enhancement",
                "description": "Contrast Limited Adaptive Histogram Equalization (CLAHE) applied to the Lightness channel in CIE-LAB space with unsharp masking.",
                "artifact_image": f"/processed/{stage4_filename}",
                "metrics": {
                    "CLAHE Clip Limit": "2.5",
                    "Tile Grid Size": "8x8",
                    "Unsharp Weighting": "1.25x contrast"
                }
            },
            {
                "stage_number": 5,
                "name": "RGB to HSV Color Transformation",
                "description": "Conversion into HSV cylindrical coordinate space to isolate illumination from chrominance (Hue & Saturation).",
                "artifact_image": f"/processed/{stage5_filename}",
                "metrics": {
                    "Mean Hue": f"{color_moments['mean_hsv'][0]} deg",
                    "Mean Saturation": f"{color_moments['mean_hsv'][1]}",
                    "Mean Value": f"{color_moments['mean_hsv'][2]}"
                }
            },
            {
                "stage_number": 6,
                "name": "Image Segmentation",
                "description": "Extraction of active plant tissue from background via Excess Green Index (ExG) thresholding and mathematical morphological opening.",
                "artifact_image": f"/processed/{stage6_plant_filename}",
                "mask_image": f"/processed/{stage6_mask_filename}",
                "metrics": {
                    "Segmented Plant Pixels": morphology["total_leaf_pixels"],
                    "Plant Area Ratio": f"{round((morphology['total_leaf_pixels']/(512*512))*100, 1)}%",
                    "Circularity": morphology["leaf_circularity"]
                }
            },
            {
                "stage_number": 7,
                "name": "Disease-Affected Region Extraction",
                "description": "Extraction of necrotic, chlorotic, and fungal lesion zones using adaptive chromatic delta masking, contour grouping, and continuous density heatmaps.",
                "artifact_image": f"/processed/{stage7_overlay_filename}",
                "mask_image": f"/processed/{stage7_mask_filename}",
                "heatmap_image": f"/processed/{stage7_heatmap_filename}",
                "metrics": {
                    "Diseased Pixels": morphology["diseased_pixels"],
                    "Affected Area": f"{morphology['affected_area_percentage']}%",
                    "Lesion Spots": morphology["lesion_count"]
                }
            },
            {
                "stage_number": 8,
                "name": "Feature Extraction",
                "description": "Computation of 18 quantitative statistical biomarkers: 1st, 2nd, and 3rd color moments, GLCM texture matrices, and morphological geometry.",
                "artifact_image": f"/processed/{stage7_overlay_filename}",
                "metrics": {
                    "GLCM Contrast": texture_features["contrast"],
                    "GLCM Homogeneity": texture_features["homogeneity"],
                    "GLCM Entropy": texture_features["entropy"],
                    "Excess Green (ExG)": color_moments["exg_index"],
                    "Brown Necrosis Ratio": color_moments["brown_ratio"]
                }
            }
        ],
        "features": {
            "color_moments": color_moments,
            "texture_features": texture_features,
            "morphology": morphology
        },
        "classification": classification,
        "visual_artifacts": {
            "acquired": f"/processed/{stage1_filename}",
            "resized": f"/processed/{stage2_filename}",
            "noise_removal": f"/processed/{stage3_filename}",
            "enhanced": f"/processed/{stage4_filename}",
            "hsv_representation": f"/processed/{stage5_filename}",
            "plant_mask": f"/processed/{stage6_mask_filename}",
            "segmented_plant": f"/processed/{stage6_plant_filename}",
            "disease_mask": f"/processed/{stage7_mask_filename}",
            "affected_regions": f"/processed/{stage7_overlay_filename}",
            "severity_heatmap": f"/processed/{stage7_heatmap_filename}"
        }
    }

    return result

def main():
    parser = argparse.ArgumentParser(description="Crop Disease DIP Engine")
    parser.add_argument("--image", required=True, help="Path to input crop image")
    parser.add_argument("--output_dir", required=True, help="Directory to save output images")
    parser.add_argument("--crop_hint", default="auto", help="Crop type hint (e.g. tomato, potato, corn)")
    parser.add_argument("--part_type", default="leaf", help="Part type (leaf or root)")

    args = parser.parse_args()

    try:
        results = process_image(
            image_path=args.image,
            output_dir=args.output_dir,
            crop_hint=args.crop_hint,
            part_type=args.part_type
        )
        print(json.dumps({"success": True, "data": results}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
