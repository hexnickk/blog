// Types
export type ShapeType = "circle" | "square" | "ascii";
export type DitherPattern = "variable" | "bayer2" | "bayer4" | "bayer8" | "clustered" | "horizontal" | "vertical" | "diagonal" | "checkerboard" | "circular";

// Auto-scaling factors for different shapes to normalize visual density
export const SHAPE_SCALE_FACTORS: Record<ShapeType, number> = {
  circle: 1.0,
  square: 0.75,
  ascii: 1.2,
};

// ASCII art character gradient - ordered from darkest (dense) to lightest (sparse)
export const ASCII_GRADIENT = "@%#*+=-:. ";

// Dithering matrices for ordered dithering (normalized to 0-1 range)

// 2x2 Bayer - Coarse pattern, larger blocks
const BAYER_MATRIX_2x2 = [
  [0, 2],
  [3, 1]
].map(row => row.map(val => val / 4));

// 4x4 Bayer - Medium pattern
const BAYER_MATRIX_4x4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
].map(row => row.map(val => val / 16));

// 8x8 Bayer - Good balance of detail and pattern
const BAYER_MATRIX_8x8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
].map(row => row.map(val => val / 64));

// Clustered-dot halftone - Traditional newspaper look
const CLUSTERED_DOT_6x6 = [
  [24, 17, 13, 14, 18, 25],
  [16, 8, 4, 5, 9, 19],
  [12, 3, 0, 1, 6, 15],
  [11, 2, 1, 0, 7, 20],
  [23, 10, 6, 5, 11, 21],
  [31, 22, 15, 14, 26, 32]
].map(row => row.map(val => val / 36));

// Horizontal scanlines
const HORIZONTAL_LINES_4x4 = [
  [0, 0, 0, 0],
  [2, 2, 2, 2],
  [1, 1, 1, 1],
  [3, 3, 3, 3]
].map(row => row.map(val => val / 4));

// Diagonal stripes
const DIAGONAL_LINES_4x4 = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2]
].map(row => row.map(val => val / 4));

// Vertical scanlines
const VERTICAL_LINES_4x4 = [
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3]
].map(row => row.map(val => val / 4));

// Checkerboard pattern
const CHECKERBOARD_4x4 = [
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0]
].map(row => row.map(val => val / 2));

// Circular/Radial pattern
const CIRCULAR_5x5 = [
  [4, 3, 2, 3, 4],
  [3, 1, 0, 1, 3],
  [2, 0, 0, 0, 2],
  [3, 1, 0, 1, 3],
  [4, 3, 2, 3, 4]
].map(row => row.map(val => val / 5));

export const DITHER_MATRICES: Record<Exclude<DitherPattern, "variable">, number[][]> = {
  bayer2: BAYER_MATRIX_2x2,
  bayer4: BAYER_MATRIX_4x4,
  bayer8: BAYER_MATRIX_8x8,
  clustered: CLUSTERED_DOT_6x6,
  horizontal: HORIZONTAL_LINES_4x4,
  vertical: VERTICAL_LINES_4x4,
  diagonal: DIAGONAL_LINES_4x4,
  checkerboard: CHECKERBOARD_4x4,
  circular: CIRCULAR_5x5
};
