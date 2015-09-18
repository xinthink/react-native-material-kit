//
//  MKButton.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKButton.h"

@implementation MKButton
{
    MKLayerSupport *_mkLayerSupport;
}

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
    self.adjustsImageWhenHighlighted = false;

    // default properties
    self.ripplePercent = 2.2;
}


- (void)setMaskEnabled:(BOOL)enabled
{
    _mkLayerSupport.maskEnabled = enabled;
}

- (BOOL)maskEnabled
{
    return _mkLayerSupport.maskEnabled;
}

- (void)setShadowPathEnabled:(BOOL)enabled
{
    _mkLayerSupport.shadowPathEnabled = enabled;
}

- (BOOL)shadowPathEnabled
{
    return _mkLayerSupport.shadowPathEnabled;
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

#pragma mark - Touch handling

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    [_mkLayerSupport animateShowRippleAt:[touch locationInView:self]];
    [_mkLayerSupport animatePressedShadow];
    [super touchesBegan:touches withEvent:event];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    [_mkLayerSupport animateHideRipple];
    [_mkLayerSupport animateRestoreShadow];
    [super touchesEnded:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    [_mkLayerSupport animateHideRipple];
    [_mkLayerSupport animateRestoreShadow];
    [super touchesCancelled:touches withEvent:event];
}

@end
