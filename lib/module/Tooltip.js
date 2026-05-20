"use strict";

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { computeTooltipPosition } from "./utils.js";
import { getTooltipAccessibilityProps } from "./accessibility.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DEFAULT_CONFIG = {};
const DEFAULT_TOOLTIP_WIDTH = 320;
const DEFAULT_TRIANGLE_SIZE = 12;
const DEFAULT_OFFSET = 8;

/**
 * Tooltip component that displays tour information.
 * Supports automatic positioning and customizable styling.
 */
const Tooltip = ({
  title,
  description,
  position,
  tooltipPosition: tooltipPositionProp = 'bottom',
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  targetHeight = 0,
  targetWidth = 0,
  config = DEFAULT_CONFIG,
  hideNextButton = false,
  hidePrevButton = false,
  hideSkipButton = false,
  screenWidth = 0,
  screenHeight = 0
}) => {
  const {
    tooltipStyles: tooltipStylesConfig,
    showProgressDots = false,
    showStepCounter = true,
    enableBackButton = true,
    nextButtonText = 'Next',
    prevButtonText = 'Back',
    skipButtonText = 'Skip',
    doneButtonText = 'Done',
    tooltipWidth: configTooltipWidth,
    triangleSize: configTriangleSize,
    tooltipOffset: configTooltipOffset
  } = config;
  const TOOLTIP_WIDTH = configTooltipWidth ?? DEFAULT_TOOLTIP_WIDTH;
  const TRIANGLE_SIZE = configTriangleSize ?? DEFAULT_TRIANGLE_SIZE;
  const OFFSET = configTooltipOffset ?? DEFAULT_OFFSET;
  const {
    backgroundColor = '#2C2C2E',
    borderRadius = 16,
    titleColor = '#FFFFFF',
    descriptionColor = '#FFFFFF',
    buttonTextColor = '#FFFFFF',
    primaryButtonColor = '#007AFF',
    secondaryButtonColor = '#3A3A3C',
    skipButtonColor = '#FFFFFF',
    titleStyle: customTitleStyle,
    descriptionStyle: customDescriptionStyle,
    containerStyle: customContainerStyle
  } = tooltipStylesConfig ?? {};
  const targetCenterX = position.x + targetWidth / 2;

  // Smart auto-positioning
  const tooltipPosition = useMemo(() => {
    if (tooltipPositionProp === 'auto' && screenWidth > 0 && screenHeight > 0) {
      return computeTooltipPosition({
        target: {
          x: position.x,
          y: position.y,
          width: targetWidth,
          height: targetHeight
        },
        screenWidth,
        screenHeight,
        tooltipWidth: TOOLTIP_WIDTH,
        tooltipHeight: 150,
        offset: OFFSET + TRIANGLE_SIZE
      });
    }
    if (tooltipPositionProp === 'auto') return 'bottom';
    return tooltipPositionProp;
  }, [tooltipPositionProp, position.x, position.y, targetWidth, targetHeight, screenWidth, screenHeight, TOOLTIP_WIDTH, OFFSET, TRIANGLE_SIZE]);

  // Compute tooltip body position and style
  const tooltipBodyStyle = useMemo(() => {
    if (tooltipPosition === 'top' || tooltipPosition === 'bottom') {
      const pad = 16;
      const idealLeft = targetCenterX - TOOLTIP_WIDTH / 2;
      const minLeft = pad;
      const maxLeft = screenWidth - TOOLTIP_WIDTH - pad;
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));
      return {
        left: clampedLeft,
        maxWidth: TOOLTIP_WIDTH,
        minWidth: 100
      };
    }
    return {
      left: undefined,
      maxWidth: TOOLTIP_WIDTH,
      minWidth: 100
    };
  }, [tooltipPosition, targetCenterX, TOOLTIP_WIDTH, screenWidth]);
  const getTooltipPosition = () => {
    const SAFE_MARGIN = 8;
    switch (tooltipPosition) {
      case 'top':
        {
          const bottomVal = screenHeight - position.y + OFFSET + TRIANGLE_SIZE;
          // Clamp so tooltip doesn't go above the screen
          return {
            bottom: Math.min(bottomVal, screenHeight - SAFE_MARGIN)
          };
        }
      case 'bottom':
        {
          const topVal = position.y + targetHeight + OFFSET + TRIANGLE_SIZE;
          // Clamp so tooltip doesn't go below the screen
          return {
            top: Math.min(topVal, screenHeight - SAFE_MARGIN)
          };
        }
      case 'left':
        {
          const topVal = Math.max(SAFE_MARGIN, Math.min(position.y + targetHeight / 2 - 40, screenHeight - SAFE_MARGIN));
          return {
            right: screenWidth - position.x + OFFSET + TRIANGLE_SIZE,
            top: topVal
          };
        }
      case 'right':
        {
          const topVal = Math.max(SAFE_MARGIN, Math.min(position.y + targetHeight / 2 - 40, screenHeight - SAFE_MARGIN));
          return {
            left: position.x + targetWidth + OFFSET + TRIANGLE_SIZE,
            top: topVal
          };
        }
      default:
        return {
          top: position.y + targetHeight + OFFSET + TRIANGLE_SIZE
        };
    }
  };
  const getTriangleStyle = () => {
    const baseTriangle = {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      position: 'absolute'
    };

    // Arrow tip should point at targetCenterX (screen coordinate).
    // The triangle is inside tooltipWrapper which starts at screen x=0,
    // so its `left` is in screen coordinates.
    // Clamp so arrow stays visually within the tooltip body.
    const tooltipLeft = tooltipBodyStyle.left ?? 0;
    const rawTriangleLeft = targetCenterX - TRIANGLE_SIZE;
    const minTriangle = tooltipLeft + borderRadius;
    const maxTriangle = tooltipLeft + TOOLTIP_WIDTH - borderRadius - TRIANGLE_SIZE * 2;
    const relativeTriangleLeft = Math.max(minTriangle, Math.min(rawTriangleLeft, maxTriangle));

    // Overlap arrow by 1px to eliminate subpixel gap
    const OVERLAP = 1;
    switch (tooltipPosition) {
      case 'top':
        return {
          ...baseTriangle,
          borderLeftWidth: TRIANGLE_SIZE,
          borderRightWidth: TRIANGLE_SIZE,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: backgroundColor,
          borderTopWidth: TRIANGLE_SIZE,
          bottom: -TRIANGLE_SIZE + OVERLAP,
          left: relativeTriangleLeft
        };
      case 'bottom':
        return {
          ...baseTriangle,
          borderLeftWidth: TRIANGLE_SIZE,
          borderRightWidth: TRIANGLE_SIZE,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: backgroundColor,
          borderBottomWidth: TRIANGLE_SIZE,
          top: -TRIANGLE_SIZE + OVERLAP,
          left: relativeTriangleLeft
        };
      case 'left':
        return {
          ...baseTriangle,
          borderTopWidth: TRIANGLE_SIZE,
          borderBottomWidth: TRIANGLE_SIZE,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: backgroundColor,
          borderLeftWidth: TRIANGLE_SIZE,
          right: -TRIANGLE_SIZE + OVERLAP,
          top: 20
        };
      case 'right':
        return {
          ...baseTriangle,
          borderTopWidth: TRIANGLE_SIZE,
          borderBottomWidth: TRIANGLE_SIZE,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: backgroundColor,
          borderRightWidth: TRIANGLE_SIZE,
          left: -TRIANGLE_SIZE + OVERLAP,
          top: 20
        };
      default:
        return {
          ...baseTriangle,
          borderLeftWidth: TRIANGLE_SIZE,
          borderRightWidth: TRIANGLE_SIZE,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: backgroundColor,
          borderBottomWidth: TRIANGLE_SIZE,
          top: -TRIANGLE_SIZE + OVERLAP,
          left: relativeTriangleLeft
        };
    }
  };
  const showPrev = enableBackButton && !hidePrevButton && Boolean(onPrev) && currentStep > 0;
  const showSkip = !hideSkipButton;
  const showNext = !hideNextButton;

  // Accessibility
  const a11yProps = getTooltipAccessibilityProps({
    id: '',
    title,
    description,
    accessibilityLabel: undefined
  }, currentStep, totalSteps, config);
  return /*#__PURE__*/_jsx(View, {
    style: [internalStyles.container, getTooltipPosition()],
    children: /*#__PURE__*/_jsxs(View, {
      style: internalStyles.tooltipWrapper,
      children: [/*#__PURE__*/_jsx(View, {
        style: getTriangleStyle()
      }), /*#__PURE__*/_jsxs(View, {
        ...a11yProps,
        style: [internalStyles.tooltipBody, {
          backgroundColor,
          borderRadius
        }, tooltipBodyStyle, customContainerStyle],
        children: [/*#__PURE__*/_jsxs(View, {
          style: internalStyles.header,
          children: [/*#__PURE__*/_jsx(Text, {
            style: [internalStyles.titleText, {
              color: titleColor
            }, customTitleStyle],
            numberOfLines: 2,
            children: title
          }), showSkip ? /*#__PURE__*/_jsx(Pressable, {
            style: [internalStyles.skipButton, {
              borderColor: skipButtonColor
            }],
            onPress: onSkip,
            hitSlop: 8,
            accessibilityRole: "button",
            accessibilityLabel: `${skipButtonText} tour`,
            children: /*#__PURE__*/_jsx(Text, {
              style: [internalStyles.skipText, {
                color: skipButtonColor
              }],
              children: skipButtonText
            })
          }) : null]
        }), /*#__PURE__*/_jsx(Text, {
          style: [internalStyles.descriptionText, {
            color: descriptionColor
          }, customDescriptionStyle],
          children: description
        }), /*#__PURE__*/_jsxs(View, {
          style: internalStyles.footer,
          children: [showProgressDots && totalSteps > 1 ? /*#__PURE__*/_jsx(View, {
            style: internalStyles.dotsContainer,
            children: Array.from({
              length: totalSteps
            }).map((_, index) => /*#__PURE__*/_jsx(View, {
              style: [internalStyles.dot, {
                backgroundColor: index === currentStep ? primaryButtonColor : descriptionColor,
                opacity: index === currentStep ? 1 : 0.3
              }, index === currentStep && internalStyles.dotActive]
            }, `dot-${index}`))
          }) : null, /*#__PURE__*/_jsxs(View, {
            style: internalStyles.navigationRow,
            children: [showStepCounter && totalSteps > 1 ? /*#__PURE__*/_jsxs(Text, {
              style: [internalStyles.stepCounter, {
                color: descriptionColor
              }],
              children: [currentStep + 1, "/", totalSteps]
            }) : null, /*#__PURE__*/_jsxs(View, {
              style: internalStyles.buttonsContainer,
              children: [showPrev ? /*#__PURE__*/_jsx(Pressable, {
                onPress: onPrev,
                style: [internalStyles.button, {
                  backgroundColor: secondaryButtonColor
                }],
                accessibilityRole: "button",
                accessibilityLabel: `${prevButtonText}, go to previous step`,
                children: /*#__PURE__*/_jsx(Text, {
                  style: [internalStyles.buttonText, {
                    color: buttonTextColor
                  }],
                  children: prevButtonText
                })
              }) : null, showNext ? /*#__PURE__*/_jsx(Pressable, {
                onPress: onNext,
                style: [internalStyles.buttonPrimary, {
                  backgroundColor: primaryButtonColor
                }],
                accessibilityRole: "button",
                accessibilityLabel: currentStep === totalSteps - 1 ? `${doneButtonText}, finish tour` : `${nextButtonText}, go to step ${currentStep + 2}`,
                children: /*#__PURE__*/_jsx(Text, {
                  style: [internalStyles.buttonPrimaryText, {
                    color: buttonTextColor
                  }],
                  children: currentStep === totalSteps - 1 ? doneButtonText : nextButtonText
                })
              }) : null]
            })]
          })]
        })]
      })]
    })
  });
};
const internalStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000
  },
  tooltipWrapper: {
    position: 'relative'
  },
  tooltipBody: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  titleText: {
    fontSize: 16,
    flex: 1,
    ...Platform.select({
      ios: {
        fontWeight: '600'
      },
      android: {
        fontWeight: '700'
      },
      default: {
        fontWeight: '600'
      }
    })
  },
  skipButton: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600'
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
    lineHeight: 20
  },
  footer: {
    gap: 12
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  dotActive: {
    width: 20
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '500'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  buttonPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  buttonPrimaryText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map