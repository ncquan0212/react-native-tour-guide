import React, { type ReactNode } from 'react';
import type { TourGuideContextValue } from './types';
export interface TourGuideProviderProps {
    children: ReactNode;
}
/**
 * Provider component that wraps your app to enable tour guide functionality.
 * Place this at the root of your app, typically in App.tsx.
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
export declare const TourGuideProvider: React.FC<TourGuideProviderProps>;
/**
 * Hook to access tour guide functionality.
 * Must be used within a TourGuideProvider.
 *
 * @example
 * ```tsx
 * const { startTour, isActive } = useTourGuide();
 *
 * const handleStartTour = () => {
 *   startTour([
 *     {
 *       id: 'step1',
 *       targetRef: myButtonRef,
 *       title: 'Welcome!',
 *       description: 'This is your first step.',
 *     },
 *   ]);
 * };
 * ```
 */
export declare const useTourGuide: () => TourGuideContextValue;
//# sourceMappingURL=TourGuideContext.d.ts.map