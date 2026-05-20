"use strict";

// Main exports
export { TourGuideProvider, useTourGuide } from "./TourGuideContext.js";
export { default as TourGuideOverlay } from "./TourGuideOverlay.js";
export { default as SpotlightOverlay } from "./SpotlightOverlay.js";
export { default as Tooltip } from "./Tooltip.js";

// Hook exports
export { useTourPersistence } from "./useTourPersistence.js";

// Theme exports
export { darkTheme, lightTheme, minimalTheme, vibrantTheme, createTheme } from "./themes.js";

// Shape exports
export { computeShape } from "./shapes.js";

// Utility exports (useful for custom tooltip renderers)
export { computeTooltipPosition, validateRef, extractBorderRadius } from "./utils.js";
export { announceStep, getTooltipAccessibilityProps } from "./accessibility.js";

// Type exports
//# sourceMappingURL=index.js.map