//
//  MKTextFieldManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/16.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKTextField.h"
#import "RCTViewManager.h"

@interface MKTextFieldManager : RCTViewManager
@end

@implementation MKTextFieldManager

RCT_EXPORT_MODULE()

- (UIView*)view {
    return [[MKTextField alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(padding, CGSize)
RCT_EXPORT_VIEW_PROPERTY(floatingPlaceholderEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(floatingLabelBottomMargin, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(floatingLabelTextColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderHighlightWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

// -----------------------------
// common MKLayer properties

RCT_REMAP_VIEW_PROPERTY(shadowColor, layer.shadowColor, CGColor)
RCT_REMAP_VIEW_PROPERTY(shadowOffset, layer.shadowOffset, CGSize)
RCT_REMAP_VIEW_PROPERTY(shadowOpacity, layer.shadowOpacity, float)
RCT_REMAP_VIEW_PROPERTY(shadowRadius, layer.shadowRadius, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(cornerRadius, float)
RCT_EXPORT_VIEW_PROPERTY(maskEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rippleEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerCornerRadius, float)
RCT_EXPORT_VIEW_PROPERTY(backgroundAniEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(ripplePercent, float)
RCT_EXPORT_VIEW_PROPERTY(rippleLayerColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(rippleAniTimingFunction, rippleAniTimingFunctionByName, NSString)
RCT_REMAP_VIEW_PROPERTY(rippleLocation, rippleLocationByName, NSString)

@end