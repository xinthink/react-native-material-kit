//
//  MKButton.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKButton.h"

@implementation MKButton

@synthesize maskEnabled;
@synthesize rippleLocation;
@synthesize ripplePercent;
@synthesize backgroundLayerCornerRadius;
@synthesize cornerRadius;
@synthesize backgroundAniEnabled;
@synthesize rippleLayerColor;
@synthesize backgroundLayerColor;

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
    maskEnabled = enabled;
    [self.mkLayer enableMask:enabled];
}

- (BOOL)maskEnabled {
    return maskEnabled;
}

- (void)setRippleLocation:(MKRippleLocation)location {
    rippleLocation = location;
    self.mkLayer.rippleLocation = location;
}

- (MKRippleLocation)rippleLocation {
    return rippleLocation;
}

- (void)setRipplePercent:(float)percent {
    ripplePercent = percent;
    self.mkLayer.ripplePercent = percent;
}

- (float)ripplePercent {
    return ripplePercent;
}

- (void)setBackgroundLayerCornerRadius:(float)radius {
    backgroundLayerCornerRadius = radius;
    [self.mkLayer setBackgroundLayerCornerRadius:radius];
}

- (float)backgroundLayerCornerRadius {
    return backgroundLayerCornerRadius;
}

- (MKLayer *)mkLayer {
    if (!_mkLayer) {
        _mkLayer = [[MKLayer alloc] initWithSuperLayer:self.layer];
    }
    
    return _mkLayer;
}

- (void)setBackgroundAniEnabled:(BOOL)enabled {
    backgroundAniEnabled = enabled;
    if (!backgroundAniEnabled) {
        [self.mkLayer enableOnlyCircleLayer];
    }
}

- (BOOL)backgroundAniEnabled {
    return backgroundAniEnabled;
}

- (void)setCornerRadius:(float)radius {
    cornerRadius = radius;
    [self.mkLayer setMaskLayerCornerRadius:radius];
}

- (float)cornerRadius {
    return cornerRadius;
}

- (void)setRippleLayerColor:(UIColor *)color {
    rippleLayerColor = color;
    [self.mkLayer setCircleLayerColor:color];
}

- (UIColor *)rippleLayerColor { return rippleLayerColor; }

- (void)setBackgroundLayerColor:(UIColor *)color {
    backgroundLayerColor = color;
    [self.mkLayer setBackgroundLayerColor:color];
}

- (UIColor *)backgroundLayerColor { return backgroundLayerColor; }

- (void)setBounds:(CGRect)bounds {
    [super setBounds:bounds];
    [self.mkLayer superLayerDidResize];
}

- (BOOL)beginTrackingWithTouch:(UITouch *)touch
                     withEvent:(UIEvent *)event {
    if (rippleLocation == MKRippleTapLocation) {
        [self.mkLayer didChangeTapLocation:[touch locationInView:self]];
    }
    
    // rippleLayer animation
    [self.mkLayer animateScaleForCircleLayer:@0.45
                                     toScale:@1.0
                              timingFunction:self.rippleAniTimingFunction
                                    duration:self.rippleAniDuration];
    
    // backgroundLayer animation
    if (backgroundAniEnabled) {
        [self.mkLayer animateAlphaForBackgroundLayer:self.backgroundAniTimingFunction
                                            duration:self.backgroundAniDuration];
    }
    
    // shadow animation for self
    if (self.shadowAniEnabled) {
        id shadowRadius = [NSNumber numberWithDouble:self.layer.shadowRadius];
        id shadowOpacity = [NSNumber numberWithDouble:self.layer.shadowOpacity];
        [self.mkLayer animateSuperLayerShadow:@10
                                     toRadius:shadowRadius
                                  fromOpacity:@0
                                    toOpacity:shadowOpacity
                               timingFunction:self.shadowAniTimingFunction
                                     duration:self.shadowAniDuration];
    }
    
    return [super beginTrackingWithTouch:touch withEvent:event];
}

@end
