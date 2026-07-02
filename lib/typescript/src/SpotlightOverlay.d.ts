import React from 'react';
import type { SpotlightTarget, SpotlightStyles } from './types';
import type { SpotlightBorderRadius } from './shapes';
export interface SpotlightOverlayProps {
    target: SpotlightTarget | null;
    /** Extra view-only cutouts punched into the same overlay (multi-hole spotlight). */
    extraTargets?: SpotlightTarget[];
    padding?: number;
    borderRadius?: SpotlightBorderRadius;
    styles?: SpotlightStyles;
    screenWidth: number;
    screenHeight: number;
    animationDuration?: number;
    onBackdropPress?: () => void;
    onSpotlightPress?: () => void;
}
/**
 * Component that creates a spotlight effect with a dark overlay.
 * Supports smooth animated transitions between targets.
 * The spotlight automatically matches the target's shape via border radius.
 * Optionally supports blur and gradient effects if dependencies are installed.
 */
declare const SpotlightOverlay: React.FC<SpotlightOverlayProps>;
export default SpotlightOverlay;
//# sourceMappingURL=SpotlightOverlay.d.ts.map