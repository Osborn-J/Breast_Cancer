export const FEATURE_NAMES = [
  "Mean Radius", "Mean Texture", "Mean Perimeter", "Mean Area", "Mean Smoothness",
  "Mean Compactness", "Mean Concavity", "Mean Concave Points", "Mean Symmetry", "Mean Fractal Dimension",
  "Radius SE", "Texture SE", "Perimeter SE", "Area SE", "Smoothness SE",
  "Compactness SE", "Concavity SE", "Concave Points SE", "Symmetry SE", "Fractal Dimension SE",
  "Worst Radius", "Worst Texture", "Worst Perimeter", "Worst Area", "Worst Smoothness",
  "Worst Compactness", "Worst Concavity", "Worst Concave Points", "Worst Symmetry", "Worst Fractal Dimension"
];

// Typical ranges for the "Mean" features to make sliders feel natural
export const FEATURE_RANGES = {
  radius: { min: 5, max: 30 },
  texture: { min: 5, max: 40 },
  area: { min: 100, max: 2500 },
};