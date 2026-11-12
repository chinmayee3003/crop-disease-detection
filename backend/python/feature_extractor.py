"""
Digital Image Processing Feature Extraction Module
Extracts color moments, GLCM texture metrics, and morphological descriptors
from segmented plant and disease regions.
"""

import numpy as np
import cv2

def compute_color_moments(image_rgb, mask=None):
    """
    Computes first, second, and third color moments (Mean, Std Dev, Skewness)
    for both RGB and HSV color representations.
    """
    if mask is not None and np.count_nonzero(mask) > 0:
        pixels_rgb = image_rgb[mask > 0]
    else:
        pixels_rgb = image_rgb.reshape(-1, 3)

    if len(pixels_rgb) == 0:
        return {
            "mean_rgb": [0, 0, 0],
            "std_rgb": [0, 0, 0],
            "skew_rgb": [0, 0, 0],
            "mean_hsv": [0, 0, 0],
            "std_hsv": [0, 0, 0],
            "skew_hsv": [0, 0, 0],
            "exg_index": 0.0,
            "brown_ratio": 0.0
        }

    # RGB Moments
    r = pixels_rgb[:, 0].astype(np.float64)
    g = pixels_rgb[:, 1].astype(np.float64)
    b = pixels_rgb[:, 2].astype(np.float64)

    mean_r, mean_g, mean_b = float(np.mean(r)), float(np.mean(g)), float(np.mean(b))
    std_r, std_g, std_b = float(np.std(r)), float(np.std(g)), float(np.std(b))

    # Skewness: E[(X - mean)^3] / std^3
    def get_skew(arr, mean, std):
        if std < 1e-4:
            return 0.0
        return float(np.mean(((arr - mean) / std) ** 3))

    skew_r = get_skew(r, mean_r, std_r)
    skew_g = get_skew(g, mean_g, std_g)
    skew_b = get_skew(b, mean_b, std_b)

    # HSV Moments
    # Convert RGB array to HSV
    pixels_bgr_img = np.expand_dims(pixels_rgb[:, ::-1], axis=0).astype(np.uint8)
    pixels_hsv_img = cv2.cvtColor(pixels_bgr_img, cv2.COLOR_BGR2HSV)[0]
    h = pixels_hsv_img[:, 0].astype(np.float64)
    s = pixels_hsv_img[:, 1].astype(np.float64)
    v = pixels_hsv_img[:, 2].astype(np.float64)

    mean_h, mean_s, mean_v = float(np.mean(h)), float(np.mean(s)), float(np.mean(v))
    std_h, std_s, std_v = float(np.std(h)), float(np.std(s)), float(np.std(v))
    skew_h = get_skew(h, mean_h, std_h)
    skew_s = get_skew(s, mean_s, std_s)
    skew_v = get_skew(v, mean_v, std_v)

    # Agronomic Color Indices: Excess Green (ExG = 2G - R - B)
    # Normalized range roughly [-255, 510]
    exg = float(2 * mean_g - mean_r - mean_b)

    # Brown / necrotic ratio approximation:
    # Brown pixels typically have R > G, G > B, and moderate saturation
    brown_mask = (r > g) & (g > b) & (s > 40)
    brown_ratio = float(np.sum(brown_mask) / max(len(r), 1))

    return {
        "mean_rgb": [round(mean_r, 2), round(mean_g, 2), round(mean_b, 2)],
        "std_rgb": [round(std_r, 2), round(std_g, 2), round(std_b, 2)],
        "skew_rgb": [round(skew_r, 3), round(skew_g, 3), round(skew_b, 3)],
        "mean_hsv": [round(mean_h, 2), round(mean_s, 2), round(mean_v, 2)],
        "std_hsv": [round(std_h, 2), round(std_s, 2), round(std_v, 2)],
        "skew_hsv": [round(skew_h, 3), round(skew_s, 3), round(skew_v, 3)],
        "exg_index": round(exg, 2),
        "brown_ratio": round(brown_ratio, 4)
    }

def compute_glcm_texture(gray_img, mask=None, levels=16):
    """
    Computes Gray Level Co-occurrence Matrix (GLCM) statistical texture features:
    - Contrast: measures local variations
    - Dissimilarity: measures difference between gray levels
    - Homogeneity: measures closeness of elements to diagonal
    - Energy / Angular Second Moment (ASM): measures uniformity
    - Correlation: measures linear dependency of gray levels
    - Entropy: measures randomness of textural distribution
    """
    if mask is not None:
        # Zero out outside mask
        gray_masked = cv2.bitwise_and(gray_img, gray_img, mask=mask)
    else:
        gray_masked = gray_img.copy()

    # Quantize to specified number of gray levels (e.g. 16 for robust co-occurrence)
    quantized = (gray_masked // (256 // levels)).astype(np.uint8)

    # Compute GLCM with displacement d=(1, 0) and d=(0, 1)
    glcm = np.zeros((levels, levels), dtype=np.float64)
    h, w = quantized.shape

    # Horizontal pairs (i, j)
    left = quantized[:, :-1]
    right = quantized[:, 1:]
    if mask is not None:
        valid_pairs = (mask[:, :-1] > 0) & (mask[:, 1:] > 0)
        left = left[valid_pairs]
        right = right[valid_pairs]
    else:
        left = left.ravel()
        right = right.ravel()

    for i, j in zip(left, right):
        glcm[i, j] += 1
        glcm[j, i] += 1  # symmetric

    # Vertical pairs
    top = quantized[:-1, :]
    bottom = quantized[1:, :]
    if mask is not None:
        valid_pairs_v = (mask[:-1, :] > 0) & (mask[1:, :] > 0)
        top = top[valid_pairs_v]
        bottom = bottom[valid_pairs_v]
    else:
        top = top.ravel()
        bottom = bottom.ravel()

    for i, j in zip(top, bottom):
        glcm[i, j] += 1
        glcm[j, i] += 1

    total_pairs = np.sum(glcm)
    if total_pairs == 0:
        return {
            "contrast": 0.0,
            "dissimilarity": 0.0,
            "homogeneity": 1.0,
            "energy": 0.0,
            "correlation": 0.0,
            "entropy": 0.0
        }

    # Normalize GLCM to joint probability distribution P(i, j)
    p = glcm / total_pairs

    # Coordinate grids
    i_coords, j_coords = np.indices((levels, levels))
    diff = np.abs(i_coords - j_coords)

    # Contrast = sum(P_ij * (i - j)^2)
    contrast = float(np.sum(p * (diff ** 2)))

    # Dissimilarity = sum(P_ij * |i - j|)
    dissimilarity = float(np.sum(p * diff))

    # Homogeneity = sum(P_ij / (1 + (i - j)^2))
    homogeneity = float(np.sum(p / (1.0 + (diff ** 2))))

    # Energy (ASM) = sum(P_ij^2)
    energy = float(np.sum(p ** 2))

    # Entropy = -sum(P_ij * log2(P_ij + eps))
    eps = 1e-12
    entropy = float(-np.sum(p * np.log2(p + eps)))

    # Correlation = sum((i - mu_i) * (j - mu_j) * P_ij) / (sigma_i * sigma_j)
    mu_i = np.sum(i_coords * p)
    mu_j = np.sum(j_coords * p)
    sigma_i = np.sqrt(np.sum(((i_coords - mu_i) ** 2) * p))
    sigma_j = np.sqrt(np.sum(((j_coords - mu_j) ** 2) * p))
    if sigma_i * sigma_j > 1e-6:
        correlation = float(np.sum((i_coords - mu_i) * (j_coords - mu_j) * p) / (sigma_i * sigma_j))
    else:
        correlation = 1.0

    return {
        "contrast": round(contrast, 3),
        "dissimilarity": round(dissimilarity, 3),
        "homogeneity": round(homogeneity, 3),
        "energy": round(energy, 4),
        "correlation": round(correlation, 3),
        "entropy": round(entropy, 3)
    }

def compute_morphology(leaf_mask, disease_mask):
    """
    Extracts geometric, shape, and coverage metrics from leaf & disease masks.
    """
    total_leaf_pixels = int(np.count_nonzero(leaf_mask))
    disease_pixels = int(np.count_nonzero(disease_mask))

    affected_pct = 0.0
    if total_leaf_pixels > 0:
        affected_pct = round((disease_pixels / total_leaf_pixels) * 100.0, 2)

    # Find disease contours
    disease_contours, _ = cv2.findContours(disease_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    lesion_count = len([c for c in disease_contours if cv2.contourArea(c) > 10])

    # Leaf perimeter and circularity
    leaf_contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    leaf_perimeter = 0.0
    leaf_circularity = 0.0

    if leaf_contours:
        c_leaf = max(leaf_contours, key=cv2.contourArea)
        leaf_perimeter = float(cv2.arcLength(c_leaf, True))
        c_area = float(cv2.contourArea(c_leaf))
        if leaf_perimeter > 0:
            # 4 * pi * Area / (Perimeter^2)
            leaf_circularity = float(4.0 * np.pi * c_area / (leaf_perimeter ** 2))

    # Lesion statistics
    lesion_areas = [cv2.contourArea(c) for c in disease_contours if cv2.contourArea(c) > 10]
    avg_lesion_area = float(np.mean(lesion_areas)) if lesion_areas else 0.0
    max_lesion_area = float(np.max(lesion_areas)) if lesion_areas else 0.0

    return {
        "total_leaf_pixels": total_leaf_pixels,
        "diseased_pixels": disease_pixels,
        "affected_area_percentage": affected_pct,
        "lesion_count": lesion_count,
        "avg_lesion_area_pixels": round(avg_lesion_area, 1),
        "max_lesion_area_pixels": round(max_lesion_area, 1),
        "leaf_perimeter": round(leaf_perimeter, 1),
        "leaf_circularity": round(leaf_circularity, 3)
    }
