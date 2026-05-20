import type { TourStep, TourGuideConfig } from './types';
/**
 * Announce a step change to screen readers (VoiceOver / TalkBack).
 */
export declare const announceStep: (step: TourStep, stepIndex: number, totalSteps: number, config?: TourGuideConfig) => void;
/**
 * Build the accessibility label for the tooltip container.
 */
export declare const getTooltipAccessibilityProps: (step: TourStep, stepIndex: number, totalSteps: number, config?: TourGuideConfig) => {
    accessible?: undefined;
    accessibilityRole?: undefined;
    accessibilityLabel?: undefined;
    accessibilityHint?: undefined;
    accessibilityLiveRegion?: undefined;
} | {
    accessible: boolean;
    accessibilityRole: "alert";
    accessibilityLabel: string;
    accessibilityHint: string;
    accessibilityLiveRegion: "polite";
};
//# sourceMappingURL=accessibility.d.ts.map