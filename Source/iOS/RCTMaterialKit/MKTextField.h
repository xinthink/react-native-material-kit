//
//  MKTextField.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/10.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#ifndef RCTMaterialKit_MKTextField_h
#define RCTMaterialKit_MKTextField_h

@import UIKit;
#import "MKLayer.h"
#import "MKUtils.h"

@interface MKTextField : UITextField

@property CGSize padding;
@property CGFloat floatingLabelBottomMargin;
@property BOOL floatingPlaceholderEnabled;
@property UIFont *floatingLabelFont;
@property UIColor *floatingLabelTextColor;
@property BOOL bottomBorderEnabled;
@property CGFloat bottomBorderWidth;
@property CGFloat bottomBorderHighlightWidth;
@property UIColor *bottomBorderColor;


// -------------------------------
// common properties of MKLayers

@property BOOL maskEnabled;
@property BOOL rippleEnabled;
@property MKRippleLocation rippleLocation;
@property NSString *rippleLocationByName;
@property float ripplePercent;
@property float backgroundLayerCornerRadius;
@property float cornerRadius;

// animations
@property BOOL shadowAniEnabled;
@property BOOL backgroundAniEnabled;
@property float rippleAniDuration;
@property float backgroundAniDuration;
@property float shadowAniDuration;
@property MKTimingFunction *rippleAniTimingFunction;
@property NSString *rippleAniTimingFunctionByName;
@property MKTimingFunction *backgroundAniTimingFunction;
@property MKTimingFunction *shadowAniTimingFunction;

// color
@property UIColor *rippleLayerColor;
@property UIColor *backgroundLayerColor;

@end

#endif
