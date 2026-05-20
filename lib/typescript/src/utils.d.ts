import type { MeasurableRef, SpotlightTarget } from './types';
import type { SpotlightBorderRadius } from './shapes';
/**
 * Compute the best tooltip position based on available screen space.
 * Prefers: bottom > top > right > left
 */
interface TooltipPositionOptions {
    target: SpotlightTarget;
    screenWidth: number;
    screenHeight: number;
    tooltipWidth: number;
    tooltipHeight?: number;
    offset?: number;
}
export declare const computeTooltipPosition: ({ target, screenWidth, screenHeight, tooltipWidth, tooltipHeight, offset, }: TooltipPositionOptions) => "top" | "bottom" | "left" | "right";
/**
 * Validate that a ref is valid and points to a mounted component.
 * Returns true if valid, false otherwise.
 */
export declare const validateRef: (ref: MeasurableRef | undefined, stepId: string) => boolean;
/**
 * Extract border radius values from a View style.
 * Returns a SpotlightBorderRadius (number if uniform, object if per-corner),
 * or undefined if no border radius is specified.
 */
export declare const extractBorderRadius: (style: any) => SpotlightBorderRadius | undefined;
export {};
//# sourceMappingURL=utils.d.ts.map