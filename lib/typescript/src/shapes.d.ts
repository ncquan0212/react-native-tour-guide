import type { SpotlightTarget } from './types';
/**
 * Internal type for border radius — number for uniform, object for per-corner.
 * Users specify this via `targetStyle` (auto-extracted) or `spotlightBorderRadius` (number override).
 */
export type SpotlightBorderRadius = number | {
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
};
export interface ShapeBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface RectShapeResult {
    kind: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    rx: number;
    ry: number;
}
export interface PathShapeResult {
    kind: 'path';
    d: string;
    bounds: ShapeBounds;
}
export type ShapeResult = RectShapeResult | PathShapeResult;
/**
 * Compute the spotlight shape for a target.
 * Always produces a rounded rectangle matching the target's border radius.
 * Border radii are scaled proportionally so circles stay circular with padding.
 */
export declare const computeShape: (target: SpotlightTarget, padding: number, customBorderRadius?: SpotlightBorderRadius) => ShapeResult;
//# sourceMappingURL=shapes.d.ts.map