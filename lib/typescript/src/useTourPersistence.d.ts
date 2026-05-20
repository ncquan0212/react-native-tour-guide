import type { TourStorage, TourStep, TourGuideConfig } from './types';
/**
 * Hook that adds "show only once" persistence to tours.
 * Wraps `startTour` to check if a tour has been completed before,
 * and automatically marks tours as completed when they finish.
 *
 * @param storage - Storage adapter (AsyncStorage, MMKV wrapper, etc.)
 *
 * @example
 * ```tsx
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import { useTourPersistence } from '@wrack/react-native-tour-guide';
 *
 * const { startTour, resetTour, isTourCompleted } = useTourPersistence(AsyncStorage);
 *
 * // Only shows the tour if user hasn't seen it before
 * startTour(steps, { tourId: 'onboarding' });
 *
 * // Force show again
 * await resetTour('onboarding');
 * startTour(steps, { tourId: 'onboarding' });
 * ```
 */
export declare const useTourPersistence: (storage: TourStorage) => {
    startTour: (steps: TourStep[], config?: TourGuideConfig, force?: boolean) => Promise<boolean>;
    isTourCompleted: (tourId: string) => Promise<boolean>;
    resetTour: (tourId: string) => Promise<void>;
    markCompleted: (tourId: string) => Promise<void>;
    currentStep: number;
    isActive: boolean;
    isPaused: boolean;
    activeTourId?: string;
    steps: TourStep[];
    activeSteps: TourStep[];
    config?: TourGuideConfig;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    endTour: () => void;
    goToStep: (index: number) => void;
    pauseTour: () => void;
    resumeTour: () => void;
    setTargetLayout: (layout: import("./types").SpotlightTarget | null) => void;
    targetLayout: import("./types").SpotlightTarget | null;
};
//# sourceMappingURL=useTourPersistence.d.ts.map