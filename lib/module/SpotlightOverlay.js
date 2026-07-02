"use strict";

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Animated, Pressable } from 'react-native';
import Svg, { Rect, Path, Defs, Mask } from 'react-native-svg';
import { computeShape } from "./shapes.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const DEFAULT_SPOTLIGHT_STYLES = {};

// Resolve optional dependencies once at module scope
let _resolvedBlurView;
let _resolvedLinearGradient;
let _resolvedMaskedView;
const getBlurView = () => {
  if (_resolvedBlurView === undefined) {
    try {
      _resolvedBlurView = require('@react-native-community/blur').BlurView;
    } catch {
      _resolvedBlurView = null;
    }
  }
  return _resolvedBlurView;
};
const getLinearGradient = () => {
  if (_resolvedLinearGradient === undefined) {
    try {
      _resolvedLinearGradient = require('react-native-linear-gradient').default;
    } catch {
      _resolvedLinearGradient = null;
    }
  }
  return _resolvedLinearGradient;
};
const getMaskedView = () => {
  if (_resolvedMaskedView === undefined) {
    try {
      _resolvedMaskedView = require('@react-native-masked-view/masked-view').default;
    } catch {
      _resolvedMaskedView = null;
    }
  }
  return _resolvedMaskedView;
};
let maskIdCounter = 0;
/**
 * Component that creates a spotlight effect with a dark overlay.
 * Supports smooth animated transitions between targets.
 * The spotlight automatically matches the target's shape via border radius.
 * Optionally supports blur and gradient effects if dependencies are installed.
 */
const SpotlightOverlay = ({
  target,
  extraTargets,
  padding = 0,
  borderRadius: customBorderRadius,
  styles = DEFAULT_SPOTLIGHT_STYLES,
  screenWidth,
  screenHeight,
  animationDuration = 300,
  onBackdropPress
  // onSpotlightPress,
}) => {
  const {
    overlayOpacity = 0.6,
    overlayColor = 'black',
    blurAmount = 4,
    enableBlur = false,
    enableGradient = false,
    gradientColors = ['rgba(217,217,217,0)', 'rgba(19,32,14,0.64)'],
    enablePulse = false,
    pulseColor = '#FFFFFF',
    pulseWidth = 2,
    pulseDuration = 1500,
    pulseMinOpacity = 0.2,
    pulseMaxOpacity = 0.8
  } = styles;

  // Unique mask IDs per instance to avoid SVG conflicts
  const maskIds = useRef({
    inverse: `inverse-mask-${++maskIdCounter}`,
    spotlight: `spotlight-mask-${maskIdCounter}`
  }).current;

  // Animated values for smooth spotlight transitions
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const animWidth = useRef(new Animated.Value(0)).current;
  const animHeight = useRef(new Animated.Value(0)).current;
  const animRx = useRef(new Animated.Value(0)).current;
  const animRy = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  // Path data for per-corner border radius shapes
  const [pathD, setPathD] = useState('');
  const usePathRendering = useMemo(() => {
    if (!target) return false;
    const result = computeShape(target, padding, customBorderRadius);
    return result.kind === 'path';
  }, [target, padding, customBorderRadius]);

  // Compute shape result synchronously
  const shapeResult = useMemo(() => target ? computeShape(target, padding, customBorderRadius) : null, [target, padding, customBorderRadius]);

  // Extra view-only cutouts (multi-hole). Static (no animation) — same padding/radius
  // as the primary target.
  const extraShapes = useMemo(() => (extraTargets ?? []).map(t => computeShape(t, padding, customBorderRadius)), [extraTargets, padding, customBorderRadius]);

  // Bounding box for press overlay positioning
  const bounds = useMemo(() => {
    if (!shapeResult) return null;
    if (shapeResult.kind === 'rect') {
      return {
        x: shapeResult.x,
        y: shapeResult.y,
        width: shapeResult.width,
        height: shapeResult.height
      };
    }
    return shapeResult.bounds;
  }, [shapeResult]);

  // Animation effect
  useEffect(() => {
    if (!shapeResult) return;
    if (shapeResult.kind === 'path') {
      // Path shapes (per-corner radius): set bounding box values immediately
      const b = shapeResult.bounds;
      animX.setValue(b.x);
      animY.setValue(b.y);
      animWidth.setValue(b.width);
      animHeight.setValue(b.height);
      setPathD(shapeResult.d);
      hasAnimated.current = true;
      return;
    }

    // Rect shapes
    if (!hasAnimated.current) {
      // First target — set immediately, no animation
      animX.setValue(shapeResult.x);
      animY.setValue(shapeResult.y);
      animWidth.setValue(shapeResult.width);
      animHeight.setValue(shapeResult.height);
      animRx.setValue(shapeResult.rx);
      animRy.setValue(shapeResult.ry);
      hasAnimated.current = true;
      return;
    }

    // Animate to new position
    Animated.parallel([Animated.timing(animX, {
      toValue: shapeResult.x,
      duration: animationDuration,
      useNativeDriver: false
    }), Animated.timing(animY, {
      toValue: shapeResult.y,
      duration: animationDuration,
      useNativeDriver: false
    }), Animated.timing(animWidth, {
      toValue: shapeResult.width,
      duration: animationDuration,
      useNativeDriver: false
    }), Animated.timing(animHeight, {
      toValue: shapeResult.height,
      duration: animationDuration,
      useNativeDriver: false
    }), Animated.timing(animRx, {
      toValue: shapeResult.rx,
      duration: animationDuration,
      useNativeDriver: false
    }), Animated.timing(animRy, {
      toValue: shapeResult.ry,
      duration: animationDuration,
      useNativeDriver: false
    })]).start();
  }, [shapeResult, animX, animY, animWidth, animHeight, animRx, animRy, animationDuration]);

  // Pulse animation
  useEffect(() => {
    if (!enablePulse || !target) {
      pulseOpacity.setValue(0);
      return;
    }
    const halfDuration = pulseDuration / 2;
    const loop = Animated.loop(Animated.sequence([Animated.timing(pulseOpacity, {
      toValue: pulseMaxOpacity,
      duration: halfDuration,
      useNativeDriver: true
    }), Animated.timing(pulseOpacity, {
      toValue: pulseMinOpacity,
      duration: halfDuration,
      useNativeDriver: true
    })]));
    loop.start();
    return () => loop.stop();
  }, [enablePulse, target, pulseDuration, pulseMinOpacity, pulseMaxOpacity, pulseOpacity]);
  if (!target || !shapeResult || !bounds) return null;

  // Resolve optional libraries (cached at module scope)
  const BlurView = enableBlur ? getBlurView() : null;
  const LinearGradient = enableGradient ? getLinearGradient() : null;
  const MaskedView = enableBlur && BlurView ? getMaskedView() : null;

  // --- Cutout shape rendering helpers ---
  const renderRectCutout = (fill, stroke, sw) => /*#__PURE__*/_jsx(AnimatedRect, {
    x: animX,
    y: animY,
    width: animWidth,
    height: animHeight,
    rx: animRx,
    ry: animRy,
    fill: fill,
    stroke: stroke,
    strokeWidth: sw
  });
  const renderPathCutout = (fill, stroke, sw) => /*#__PURE__*/_jsx(Path, {
    d: pathD,
    fill: fill,
    stroke: stroke,
    strokeWidth: sw
  });
  const renderCutout = (fill, stroke, sw) => usePathRendering ? renderPathCutout(fill, stroke, sw) : renderRectCutout(fill, stroke, sw);

  // Static cutouts for the extra targets (multi-hole). Keyed so they can sit in an array.
  const renderExtraCutouts = (fill, stroke, sw) => extraShapes.map((shape, i) => shape.kind === 'path' ? /*#__PURE__*/_jsx(Path, {
    d: shape.d,
    fill: fill,
    stroke: stroke,
    strokeWidth: sw
  }, `extra-${i}`) : /*#__PURE__*/_jsx(Rect, {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    rx: shape.rx,
    ry: shape.ry,
    fill: fill,
    stroke: stroke,
    strokeWidth: sw
  }, `extra-${i}`));
  return /*#__PURE__*/_jsxs(View, {
    style: {
      position: 'absolute',
      width: screenWidth,
      height: screenHeight
    },
    pointerEvents: "box-none",
    children: [/*#__PURE__*/_jsxs(View, {
      style: {
        position: 'absolute',
        width: screenWidth,
        height: screenHeight
      },
      pointerEvents: "none",
      children: [enableBlur && BlurView && MaskedView ? /*#__PURE__*/_jsxs(MaskedView, {
        style: StyleSheet.absoluteFill,
        maskElement: /*#__PURE__*/_jsxs(Svg, {
          height: screenHeight,
          width: screenWidth,
          children: [/*#__PURE__*/_jsx(Defs, {
            children: /*#__PURE__*/_jsxs(Mask, {
              id: maskIds.inverse,
              children: [/*#__PURE__*/_jsx(Rect, {
                x: "0",
                y: "0",
                width: screenWidth,
                height: screenHeight,
                fill: "white"
              }), renderCutout('black'), renderExtraCutouts('black')]
            })
          }), /*#__PURE__*/_jsx(Rect, {
            x: "0",
            y: "0",
            width: screenWidth,
            height: screenHeight,
            fill: "black",
            mask: `url(#${maskIds.inverse})`
          })]
        }),
        children: [/*#__PURE__*/_jsx(BlurView, {
          style: StyleSheet.absoluteFill,
          blurType: "light",
          blurAmount: blurAmount,
          reducedTransparencyFallbackColor: "white"
        }), enableGradient && LinearGradient ? /*#__PURE__*/_jsx(LinearGradient, {
          colors: gradientColors,
          start: {
            x: 0.5,
            y: 0
          },
          end: {
            x: 0.5,
            y: 1
          },
          style: StyleSheet.absoluteFill
        }) : null]
      }) : null, /*#__PURE__*/_jsxs(Svg, {
        height: screenHeight,
        width: screenWidth,
        style: StyleSheet.absoluteFill,
        children: [/*#__PURE__*/_jsx(Defs, {
          children: /*#__PURE__*/_jsxs(Mask, {
            id: maskIds.spotlight,
            children: [/*#__PURE__*/_jsx(Rect, {
              x: "0",
              y: "0",
              width: screenWidth,
              height: screenHeight,
              fill: "white"
            }), renderCutout('black'), renderExtraCutouts('black')]
          })
        }), /*#__PURE__*/_jsx(Rect, {
          x: "0",
          y: "0",
          width: screenWidth,
          height: screenHeight,
          fill: overlayColor,
          fillOpacity: overlayOpacity,
          mask: `url(#${maskIds.spotlight})`
        })]
      })]
    }), enablePulse ? /*#__PURE__*/_jsx(Animated.View, {
      style: [{
        position: 'absolute',
        width: screenWidth,
        height: screenHeight
      }, {
        opacity: pulseOpacity
      }],
      pointerEvents: "none",
      children: /*#__PURE__*/_jsxs(Svg, {
        height: screenHeight,
        width: screenWidth,
        children: [renderCutout('none', pulseColor, pulseWidth), renderExtraCutouts('none', pulseColor, pulseWidth)]
      })
    }) : null, /*#__PURE__*/_jsx(Pressable, {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        height: bounds.y
      },
      onPress: onBackdropPress
    }), /*#__PURE__*/_jsx(Pressable, {
      style: {
        position: 'absolute',
        left: 0,
        top: bounds.y + bounds.height,
        right: 0,
        bottom: 0
      },
      onPress: onBackdropPress
    }), /*#__PURE__*/_jsx(Pressable, {
      style: {
        position: 'absolute',
        left: 0,
        top: bounds.y,
        width: bounds.x,
        height: bounds.height
      },
      onPress: onBackdropPress
    }), /*#__PURE__*/_jsx(Pressable, {
      style: {
        position: 'absolute',
        left: bounds.x + bounds.width,
        top: bounds.y,
        right: 0,
        height: bounds.height
      },
      onPress: onBackdropPress
    })]
  });
};
export default SpotlightOverlay;
//# sourceMappingURL=SpotlightOverlay.js.map