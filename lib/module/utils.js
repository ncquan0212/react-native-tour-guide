"use strict";

import { StyleSheet } from 'react-native';

/**
 * Compute the best tooltip position based on available screen space.
 * Prefers: bottom > top > right > left
 */

export const computeTooltipPosition = ({
  target,
  screenWidth,
  screenHeight,
  tooltipWidth,
  tooltipHeight = 150,
  offset = 20
}) => {
  const spaceAbove = target.y - offset;
  const spaceBelow = screenHeight - (target.y + target.height + offset);
  const spaceLeft = target.x - offset;
  const spaceRight = screenWidth - (target.x + target.width + offset);
  if (spaceBelow >= tooltipHeight) return 'bottom';
  if (spaceAbove >= tooltipHeight) return 'top';
  if (spaceRight >= tooltipWidth * 0.6) return 'right';
  if (spaceLeft >= tooltipWidth * 0.6) return 'left';
  return spaceBelow >= spaceAbove ? 'bottom' : 'top';
};

/**
 * Validate that a ref is valid and points to a mounted component.
 * Returns true if valid, false otherwise.
 */
export const validateRef = (ref, stepId) => {
  if (!ref) {
    console.warn(`react-native-tour-guide: Step "${stepId}" has no targetRef. Showing tooltip without spotlight.`);
    return false;
  }
  if (!ref.current) {
    console.warn(`react-native-tour-guide: Step "${stepId}" targetRef.current is null. The component may not be mounted.`);
    return false;
  }
  return true;
};

/**
 * Extract border radius values from a View style.
 * Returns a SpotlightBorderRadius (number if uniform, object if per-corner),
 * or undefined if no border radius is specified.
 */
export const extractBorderRadius = style => {
  if (!style) return undefined;
  const flat = StyleSheet.flatten(style);
  if (!flat) return undefined;
  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius
  } = flat;

  // No border radius properties at all
  if (borderRadius === undefined && borderTopLeftRadius === undefined && borderTopRightRadius === undefined && borderBottomLeftRadius === undefined && borderBottomRightRadius === undefined) {
    return undefined;
  }

  // Coerce to numbers (ignore string/percentage values)
  const toNum = (v, fallback) => typeof v === 'number' ? v : fallback;
  const base = toNum(borderRadius, 0);
  const tl = toNum(borderTopLeftRadius, base);
  const tr = toNum(borderTopRightRadius, base);
  const br = toNum(borderBottomRightRadius, base);
  const bl = toNum(borderBottomLeftRadius, base);

  // All corners the same → return number for smooth rect animation
  if (tl === tr && tr === br && br === bl) {
    return tl;
  }
  return {
    topLeft: tl,
    topRight: tr,
    bottomRight: br,
    bottomLeft: bl
  };
};
//# sourceMappingURL=utils.js.map