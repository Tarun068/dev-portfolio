/**
 * The client's "DP" monogram, traced from their logo PNG (1080×1080, white on transparent) into
 * exact vector shapes: two 8-point polygons on 60° angles, each the other rotated 180°.
 * The traced shapes cover the original pixels with 99.9% overlap.
 */
export const LOGO_WIDTH = 667.6;
export const LOGO_HEIGHT = 346.9;
export const LOGO_VIEWBOX = `0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`;

/**
 * The mark is drawn on six equal rows (each bar is one row tall), so every horizontal edge sits
 * on a row line. Sizing a row to a whole number of screen pixels keeps those edges crisp.
 */
export const LOGO_ROWS = 6;

/** Unit vector along the diagonal cut that separates the two halves (60° from horizontal). */
export const LOGO_CUT = { x: 0.5, y: 0.866 } as const;

export const LOGO_PATHS = {
  /** Lower-left half (the "d"). Starts at the bottom of the cut. */
  left: "M400.6 346.9L200.3 0L133.2 0L300.1 289L100.3 289L167 173.5L133.6 115.5L0 346.9Z",
  /** Upper-right half (the "P"). Starts at the top of the cut. */
  right: "M267 0L467.3 346.9L534.3 346.9L367.5 57.9L567.3 57.9L500.6 173.4L534 231.4L667.6 0Z",
} as const;
