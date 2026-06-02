import React from 'react';
/**
 * Main overlay component that displays the tour guide.
 * This should be placed at the root level of your app, after your main content.
 *
 * @example
 * ```tsx
 * import { TourGuideProvider, TourGuideOverlay } from '@wrack/react-native-tour-guide';
 *
 * export default function App() {
 *   return (
 *     <TourGuideProvider>
 *       <YourApp />
 *       <TourGuideOverlay />
 *     </TourGuideProvider>
 *   );
 * }
 * ```
 */
export interface TourGuideOverlayProps {
    /**
     * Explicit screen size override (e.g. the full edge-to-edge dimensions tracked by the app).
     * When provided (> 0), these take precedence over the internal `Dimensions.get('window')`
     * measurement — which on Android is reduced by the status/navigation bar — so the backdrop
     * covers the entire screen on edge-to-edge / tall Android devices.
     */
    screenWidth?: number;
    screenHeight?: number;
}
declare const TourGuideOverlay: React.FC<TourGuideOverlayProps>;
export default TourGuideOverlay;
//# sourceMappingURL=TourGuideOverlay.d.ts.map