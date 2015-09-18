//
//  MKSwitch.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/27.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

@import UIKit;
#import "MKLayer.h"
#import "MKToggleView.h"

/*
 * Handle (thumb) of the switch
 */
@interface MKSwitchThumb : UIView

@property float rippleRadius;
@property UIColor *onColor;
@property UIColor *offColor;

// -------------------------------
// common properties of MKLayers

// animations
@property float rippleAniDuration;
@property float shadowAniDuration;
@property MKTimingFunction *rippleAniTimingFunction;
@property MKTimingFunction *shadowAniTimingFunction;

// color
@property UIColor *rippleLayerColor;

// toggle actions
- (void)startToggleFromState:(BOOL)checked;
- (void)confirmToggleFromState:(BOOL)checked;
- (void)cancelToggleFromState:(BOOL)checked;

@end


/*
 * MDL Switch
 */
@interface MKSwitch : UIControl <MKToggle>

@property BOOL checked;
@property UIColor *onColor;
@property UIColor *offColor;
@property CGFloat slidingAniDuration;

@property (nonatomic, weak) id<MKToggleDelegate> delegate;

// properties for the thumb
@property CGFloat thumbRadius;
@property UIColor *thumbOnColor;
@property UIColor *thumbOffColor;
@property UIColor *rippleLayerColor;

@end