//
//  MKToggleView.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/25.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#ifndef RCTMaterialKit_MKToggleView_h
#define RCTMaterialKit_MKToggleView_h

@import UIKit;
#import "MKLayer.h"

@class MKToggleControl;
@protocol MKToggle, MKToggleDelegate;

/*
 * Protocol of toggle views
 */
@protocol MKToggle <NSObject>

@required
- (BOOL)checked;

@end

/*
 * Base class for toggle components
 */
@interface MKToggleView : UIControl <MKToggle>

@property BOOL checked;
@property (readonly) MKToggleControl *toggleCtl;

@property (nonatomic, weak) id<MKToggleDelegate> delegate;

- (void)setupLayer;

@end

/*
 * Generic toggle view delegate protocol
 */
@protocol MKToggleDelegate <NSObject>

@required
- (void)toggleView:(UIView<MKToggle>*)view didToggled:(BOOL)checked;

@end


/*
 * Generic animated toggle control, used as subview
 */
@interface MKToggleControl : UIView

@property UIColor *checkedColor;
@property BOOL checkedHighlightEnabled;


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

// toggle actions
- (void)startToggleFromState:(BOOL)checked;
- (void)confirmToggleFromState:(BOOL)checked;
- (void)cancelToggleFromState:(BOOL)checked;

@end

#endif
