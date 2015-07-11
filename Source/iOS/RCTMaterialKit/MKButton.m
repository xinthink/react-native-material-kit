//
//  MKButton.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKButton.h"

@implementation MKButton {
    MKLayerSupport *_mkLayerSupport;
}

- (instancetype)init {
    if (self = [super init]) {
        [self setupLayer];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self setupLayer];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        [self setupLayer];
    }
    return self;
}

- (void)setupLayer {
    _mkLayerSupport = [[MKLayerSupport alloc] initWithUIView:self];
    self.adjustsImageWhenHighlighted = false;

    // default properties
    self.maskEnabled = true;
    self.ripplePercent = 0.9;
    self.rippleLocation = MKRippleTapLocation;
    self.cornerRadius = 2.5;

    self.shadowAniEnabled = true;
    self.backgroundAniEnabled = true;
    self.rippleAniDuration = 0.75;
    self.backgroundAniDuration = 1;
    self.shadowAniDuration = 0.65;
    self.rippleAniTimingFunction = MKTimingLinear;
    self.backgroundAniTimingFunction = MKTimingLinear;
    self.shadowAniTimingFunction = MKTimingEaseOut;

    self.rippleLayerColor = [UIColor colorWithWhite:0.45 alpha:0.5];
    self.backgroundLayerColor = [UIColor colorWithWhite:0.75 alpha:0.25];
}


- (void)setMaskEnabled:(BOOL)enabled {
    _mkLayerSupport.maskEnabled = enabled;
}

- (BOOL)maskEnabled {
    return _mkLayerSupport.maskEnabled;
}

- (void)setRippleLocation:(MKRippleLocation)location {
    _mkLayerSupport.rippleLocation = location;
}

- (MKRippleLocation)rippleLocation {
    return _mkLayerSupport.rippleLocation;
}

- (void)setRippleLocationByName:(NSString *)name {
    _mkLayerSupport.rippleLocationByName = name;
}

- (NSString*)rippleLocationByName {
    return _mkLayerSupport.rippleLocationByName;
}

- (void)setRipplePercent:(float)percent {
    _mkLayerSupport.ripplePercent = percent;
}

- (float)ripplePercent {
    return _mkLayerSupport.ripplePercent;
}

- (void)setBackgroundLayerCornerRadius:(float)radius {
    _mkLayerSupport.backgroundLayerCornerRadius = radius;
}

- (float)backgroundLayerCornerRadius {
    return _mkLayerSupport.backgroundLayerCornerRadius;
}

- (void)setBackgroundAniEnabled:(BOOL)enabled {
    _mkLayerSupport.backgroundAniEnabled = enabled;
}

- (BOOL)backgroundAniEnabled {
    return _mkLayerSupport.backgroundAniEnabled;
}

- (void)setRippleAniTimingFunctionByName:(NSString *)name {
    _mkLayerSupport.rippleAniTimingFunctionByName = name;
}

- (NSString*)rippleAniTimingFunctionByName {
    return _mkLayerSupport.rippleAniTimingFunctionByName;
}

- (void)setCornerRadius:(float)radius {
    _mkLayerSupport.cornerRadius = radius;
}

- (float)cornerRadius {
    return _mkLayerSupport.cornerRadius;
}

- (void)setRippleLayerColor:(UIColor *)color {
    _mkLayerSupport.rippleLayerColor = color;
}

- (UIColor *)rippleLayerColor {
    return _mkLayerSupport.rippleLayerColor;
}

- (void)setBackgroundLayerColor:(UIColor *)color {
    _mkLayerSupport.backgroundLayerColor = color;
}

- (UIColor *)backgroundLayerColor {
    return _mkLayerSupport.backgroundLayerColor;
}

- (BOOL)beginTrackingWithTouch:(UITouch *)touch
                     withEvent:(UIEvent *)event {
    if (self.rippleLocation == MKRippleTapLocation) {
        [_mkLayerSupport.mkLayer didChangeTapLocation:[touch locationInView:self]];
    }

    // rippleLayer animation
    [_mkLayerSupport.mkLayer animateScaleForCircleLayer:@0.45
                                     toScale:@1.0
                              timingFunction:self.rippleAniTimingFunction
                                    duration:self.rippleAniDuration];

    // backgroundLayer animation
    if (self.backgroundAniEnabled) {
        [_mkLayerSupport.mkLayer animateAlphaForBackgroundLayer:self.backgroundAniTimingFunction
                                            duration:self.backgroundAniDuration];
    }

    // shadow animation for self
    if (self.shadowAniEnabled) {
        id shadowRadius = [NSNumber numberWithDouble:self.layer.shadowRadius];
        id shadowOpacity = [NSNumber numberWithDouble:self.layer.shadowOpacity];
        [_mkLayerSupport.mkLayer animateSuperLayerShadow:@10
                                     toRadius:shadowRadius
                                  fromOpacity:@0
                                    toOpacity:shadowOpacity
                               timingFunction:self.shadowAniTimingFunction
                                     duration:self.shadowAniDuration];
    }

    return [super beginTrackingWithTouch:touch withEvent:event];
}

@end
