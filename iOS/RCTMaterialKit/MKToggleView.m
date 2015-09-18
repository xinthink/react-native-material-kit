//
//  MKToggleView.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/25.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKToggleView.h"
#import "UIColor+MKColor.h"

/*
 * Base class for toggle components
 */
@implementation MKToggleView
{
    MKToggleControl *_toggleCtl;
}

@synthesize checked;

#pragma mark - Lifecylce

- (instancetype)init
{
    if (self = [super init]) {
        [self setupLayer];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self setupLayer];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        [self setupLayer];
    }
    return self;
}

- (void)setupLayer
{
    _toggleCtl = [[MKToggleControl alloc] init];
    [self addSubview:_toggleCtl];
}

#pragma mark - Custom accessors

- (MKToggleControl*)toggleCtl
{
    return _toggleCtl;
}

- (void)setChecked:(BOOL)isChecked
{
    [self.toggleCtl confirmToggleFromState:checked];
    [self _internalSetChecked:isChecked];
}

- (void)_internalSetChecked:(BOOL)isChecked
{
    checked = isChecked;
    if (self.delegate) {
        [self.delegate toggleView:self didToggled:self.checked];
    }
}

- (BOOL)checked
{
    return checked;
}

#pragma mark - Touch event handling

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    // start toggle animation
    [_toggleCtl startToggleFromState:checked];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    // confirm toggle
    [_toggleCtl confirmToggleFromState:checked];
    [self _internalSetChecked:!checked];
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    // cancel animation
    [_toggleCtl cancelToggleFromState:checked];
}

@end


/*
 * Generic animated toggle control, used as subview
 */
@implementation MKToggleControl
{
    MKLayerSupport *_mkLayerSupport;
    CGFloat _borderWidth;
}

#pragma mark - Lifecycle & properties

- (instancetype)init
{
    if (self = [super init]) {
        [self setupLayer];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self setupLayer];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        [self setupLayer];
    }
    return self;
}

- (void)setupLayer
{
    _mkLayerSupport = [[MKLayerSupport alloc] initWithUIView:self];

    // default properties
    self.userInteractionEnabled = NO;
    self.layer.borderWidth = 2;

    self.cornerRadius = 2;
    self.layer.cornerRadius = self.cornerRadius;

    self.backgroundAniEnabled = false;
    self.ripplePercent = 2;
    self.rippleLocation = MKRippleCenter;
    self.rippleLayerColor = [UIColor colorWithWhite:0.45 alpha:0.3];
    self.rippleAniDuration = 0.1;
    self.rippleAniTimingFunction = MKTimingEaseIn;
}

- (CGFloat)borderWidth
{
    if (_borderWidth == 0 && self.layer.borderWidth > 0) {
        _borderWidth = self.layer.borderWidth;
    }
    return _borderWidth;
}

#pragma mark - Toggle actions
- (void)startToggleFromState:(BOOL)checked
{
    // start ripple effect
    [_mkLayerSupport animateShowRippleAt:CGPointZero];
}

- (void)confirmToggleFromState:(BOOL)checked
{
    // hide ripple
    [_mkLayerSupport animateHideRipple];
    [self animateHighlightFromState:checked];
}

- (void)cancelToggleFromState:(BOOL)checked
{
    // hide ripple
    [_mkLayerSupport animateHideRipple];
}

#pragma mark - Common MKLayer properties

- (void)setMaskEnabled:(BOOL)enabled
{
    _mkLayerSupport.maskEnabled = enabled;
}

- (BOOL)maskEnabled
{
    return _mkLayerSupport.maskEnabled;
}

- (void)setRippleEnabled:(BOOL)enabled
{
    _mkLayerSupport.rippleEnabled = enabled;
}

- (BOOL)rippleEnabled
{
    return _mkLayerSupport.rippleEnabled;
}

- (void)setRippleLocation:(MKRippleLocation)location
{
    _mkLayerSupport.rippleLocation = location;
}

- (MKRippleLocation)rippleLocation
{
    return _mkLayerSupport.rippleLocation;
}

- (void)setRippleLocationByName:(NSString *)name
{
    _mkLayerSupport.rippleLocationByName = name;
}

- (NSString*)rippleLocationByName
{
    return _mkLayerSupport.rippleLocationByName;
}

- (void)setRipplePercent:(float)percent
{
    _mkLayerSupport.ripplePercent = percent;
}

- (float)ripplePercent
{
    return _mkLayerSupport.ripplePercent;
}

- (void)setBackgroundLayerCornerRadius:(float)radius
{
    _mkLayerSupport.backgroundLayerCornerRadius = radius;
}

- (float)backgroundLayerCornerRadius
{
    return _mkLayerSupport.backgroundLayerCornerRadius;
}

- (void)setBackgroundAniEnabled:(BOOL)enabled
{
    _mkLayerSupport.backgroundAniEnabled = enabled;
}

- (BOOL)backgroundAniEnabled
{
    return _mkLayerSupport.backgroundAniEnabled;
}

- (void)setRippleAniTimingFunctionByName:(NSString *)name
{
    _mkLayerSupport.rippleAniTimingFunctionByName = name;
}

- (NSString*)rippleAniTimingFunctionByName
{
    return _mkLayerSupport.rippleAniTimingFunctionByName;
}

- (void)setCornerRadius:(float)radius
{
    _mkLayerSupport.cornerRadius = radius;
    self.layer.cornerRadius = radius;
}

- (float)cornerRadius
{
    return _mkLayerSupport.cornerRadius;
}

- (void)setRippleLayerColor:(UIColor *)color
{
    _mkLayerSupport.rippleLayerColor = color;
}

- (UIColor *)rippleLayerColor
{
    return _mkLayerSupport.rippleLayerColor;
}

- (void)setBackgroundLayerColor:(UIColor *)color
{
    _mkLayerSupport.backgroundLayerColor = color;
}

- (UIColor *)backgroundLayerColor
{
    return _mkLayerSupport.backgroundLayerColor;
}

#pragma mark - Animation

- (void)animateHighlightFromState:(BOOL)oldState
{
    if (!self.checkedHighlightEnabled) {
        return;
    }

    CALayer *theLayer = self.layer;
    BOOL targetState = !oldState;

    CGFloat destBorderWidth = targetState ? self.borderWidth : 0;
    CGColorRef destBgColor = (targetState ? self.checkedColor : [UIColor transparent]).CGColor;

    [UIView animateWithDuration:self.rippleAniDuration
                     animations:^{
                         theLayer.backgroundColor = destBgColor;
                         theLayer.borderWidth = destBorderWidth;
                     }
                     completion:nil];
}

@end
