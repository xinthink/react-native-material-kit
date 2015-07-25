//
//  MKLayer.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKLayer.h"
@import CoreGraphics;


@implementation MKTimingFunction
// static instances
static MKTimingFunction *_linear = nil;
static MKTimingFunction *_easeIn = nil;
static MKTimingFunction *_easeOut = nil;

+ (instancetype)withName:(NSString*)name {
    MKTimingFunction *inst = [[[self class] alloc] init];
    inst.name = name;
    return inst;
}

+ (instancetype)linear {
    if (_linear) {
        return _linear;
    }

    @synchronized([self class]) {
        if (!_linear) {
            _linear = [[self class] withName:@"linear"];
        }
    }

    return _linear;
}

+ (instancetype)easeIn {
    if (_easeIn) {
        return _easeIn;
    }
    
    @synchronized([self class]) {
        if (!_easeIn) {
            _easeIn = [[self class] withName:@"easeIn"];
        }
    }

    return _easeIn;
}

+ (instancetype)easeOut {
    if (_easeOut) {
        return _easeOut;
    }
    
    @synchronized([self class]) {
        if (!_easeOut) {
            _easeOut = [[self class] withName:@"easeOut"];
        }
    }

    return _easeOut;
}

+ (instancetype)customize:(float)c1x :(float)c1y :(float)c2x :(float)c2y {
    MKTimingFunction *inst = [[[self class] alloc] init];
    inst.name = nil;
    inst.c1x = c1x;
    inst.c1y = c1y;
    inst.c2x = c2x;
    inst.c2y = c2y;
    return inst;
}

- (CAMediaTimingFunction*)function {
    if (!self.name) {
        return [CAMediaTimingFunction functionWithName:self.name];
    }

    return [CAMediaTimingFunction functionWithControlPoints:self.c1x :self.c1y :self.c2x :self.c2y];
}

@end


@implementation RCTMKLayer {
    CALayer *_superLayer;
    CALayer *_backgroundLayer;
    CALayer *_rippleLayer;
    CAShapeLayer *_maskLayer;
    MKLayerResizedCallback _resizedCallback;
}

@synthesize rippleLocation;
@synthesize ripplePercent;

- (id)initWithSuperLayer:(CALayer *)superLayer {
    self = [super init];

    if (self) {
        _superLayer = superLayer;
        [_superLayer addObserver:self
                      forKeyPath:@"bounds"
                         options:NSKeyValueObservingOptionNew
                         context:nil];

        [self initRippleEffect:superLayer];
    }

    return self;
}

- (void) initRippleEffect:(CALayer*)superLayer {
    CGFloat sw = CGRectGetWidth(superLayer.bounds);
    CGFloat sh = CGRectGetHeight(superLayer.bounds);
    
    // background layer
    _backgroundLayer = [[CALayer alloc] init];
    _backgroundLayer.frame = superLayer.bounds;
    _backgroundLayer.opacity = 0.0;
    _backgroundLayer.masksToBounds = true;
    [_superLayer addSublayer:_backgroundLayer];
    
    // ripple layer
    _rippleLayer = [[CALayer alloc] init];
    CGFloat circleSize = MAX(sw, sh) * self.ripplePercent;
    CGFloat rippleCornerRadius = circleSize / 2;
    
    _rippleLayer.opacity = 0.0;
    _rippleLayer.cornerRadius = rippleCornerRadius;
    [self setCircleLayerLocationAt:CGPointMake(sw / 2, sh / 2)];
    [_backgroundLayer addSublayer:_rippleLayer];
    
    // mask layer
    _maskLayer = [[CAShapeLayer alloc] init];
    [self setMaskLayerCornerRadius:superLayer.cornerRadius];
    _backgroundLayer.mask = _maskLayer;
}

- (void)updateShadow {
    if (!self.shadowPathEnabled) {
        return;
    }
    
    // TODO support box-shadow
    CGRect shadowRect = CGRectMake(0, CGRectGetHeight(_superLayer.bounds), CGRectGetWidth(_superLayer.bounds), 1);
    _superLayer.shadowPath = CGPathCreateWithRect(shadowRect, NULL);
}

- (void)dealloc {
    [_superLayer removeObserver:self forKeyPath:@"bounds"];
    _resizedCallback = Nil;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
//    NSLog(@"value changed %@ %@", keyPath, change);
    if ([@"bounds" isEqual:keyPath]) {
        [self superLayerDidResize];
    }
}

- (void)onResized:(MKLayerResizedCallback)callback {
    _resizedCallback = callback;
}

- (void)setRippleLocation:(MKRippleLocation)location {
    rippleLocation = location;
    [self updateRippleLocation];
}

- (MKRippleLocation)rippleLocation {
    return rippleLocation;
}

- (void)updateRippleLocation {
    CGFloat sw = CGRectGetWidth(_superLayer.bounds);
    CGFloat sh = CGRectGetHeight(_superLayer.bounds);
    
    switch (rippleLocation) {
        case MKRippleCenter:
            [self setCircleLayerLocationAt:CGPointMake(sw/2, sh/2)];
            break;
        case MKRippleLeft:
            [self setCircleLayerLocationAt:CGPointMake(sw * 0.25, sh / 2)];
            break;
        case MKRippleRight:
            [self setCircleLayerLocationAt:CGPointMake(sw * 0.75, sh / 2)];
            break;
        default:
            break;
    }
}

- (void)setRipplePercent:(float)percent {
    ripplePercent = percent;
    if (_rippleLayer && ripplePercent > 0) {
        CGFloat sw = CGRectGetWidth(_superLayer.bounds);
        CGFloat sh = CGRectGetHeight(_superLayer.bounds);
        CGFloat circleSize = MAX(sw, sh) * ripplePercent;
        CGFloat circleCornerRadius = circleSize / 2;

        _rippleLayer.cornerRadius = circleCornerRadius;
        [self setCircleLayerLocationAt:CGPointMake(sw / 2, sh / 2)];
    }
}

- (float)ripplePercent {
    return ripplePercent;
}

- (void)setCircleLayerLocationAt:(CGPoint)center {
    if (!_rippleLayer) {
        return;
    }
    
    CGRect bounds = _superLayer.bounds;
    CGFloat width = CGRectGetWidth(bounds);
    CGFloat height = CGRectGetHeight(bounds);
    CGFloat subSize = MAX(width, height) * self.ripplePercent;
    CGFloat subX = center.x - subSize / 2;
    CGFloat subY = center.y - subSize / 2;

    // disable animation when changing layer frame
    [CATransaction begin];
    [CATransaction setDisableActions:true];
    _rippleLayer.cornerRadius = subSize / 2;
    _rippleLayer.frame = CGRectMake(subX, subY, subSize, subSize);
    [CATransaction commit];
}

- (void)setMaskLayerCornerRadius:(float)cornerRadius {
    if (_maskLayer) {
        _maskLayer.path = [UIBezierPath bezierPathWithRoundedRect:_backgroundLayer.bounds
                                                     cornerRadius:cornerRadius].CGPath;
    }
}

- (void)superLayerDidResize {
    if (_rippleLayer) {
        [CATransaction begin];
        [CATransaction setDisableActions:true];
        if (_backgroundLayer) {
            _backgroundLayer.frame = _superLayer.bounds;
        }
        [self setMaskLayerCornerRadius:_superLayer.cornerRadius];
        [CATransaction commit];
        [self updateRippleLocation];
    }
    
    [self updateShadow];
    
    if (_resizedCallback) {
        _resizedCallback(_superLayer.bounds);
    }
}

// has no effect if rippleLayer disabled
- (void)enableOnlyCircleLayer {
    if (_backgroundLayer) {
        [_backgroundLayer removeFromSuperlayer];
        [_superLayer addSublayer:_rippleLayer];
    }
}

- (void)setBackgroundLayerColor:(UIColor*)color {
    if (_backgroundLayer) {
        _backgroundLayer.backgroundColor = color.CGColor;
    }
}

- (void)setCircleLayerColor:(UIColor*)color {
    if (_rippleLayer) {
        _rippleLayer.backgroundColor = color.CGColor;
    }
}

- (void)didChangeTapLocation:(CGPoint)location {
    if (rippleLocation == MKRippleTapLocation) {
        [self setCircleLayerLocationAt:location];
    }
}

- (void)enableRipple:(BOOL)enabled {
    if (enabled) {
        if (!_rippleLayer) {
            [self initRippleEffect:_superLayer];
        }
        return;
    }
    
    // disable ripple effect
    [_rippleLayer removeFromSuperlayer];
    _rippleLayer = nil;
    
    [_backgroundLayer removeFromSuperlayer];
    _backgroundLayer = nil;
    
    _maskLayer = nil;
}

- (void)enableMask:(BOOL)enable {
    if (_backgroundLayer) {
        _backgroundLayer.mask = enable ? _maskLayer : nil;
        _backgroundLayer.masksToBounds = enable;
    }
}

- (void)setBackgroundLayerCornerRadius:(CGFloat)cornerRadius {
    if (_backgroundLayer) {
        _backgroundLayer.cornerRadius = cornerRadius;
    }
}

// MARK - Animation
- (void)animateScaleForCircleLayer:(id)fromScale
                           toScale:(id)toScale
                    timingFunction:(MKTimingFunction*)timingFunction
                          duration:(CFTimeInterval)duration {
    if (!_rippleLayer) {
        return;
    }
    
    CABasicAnimation *anim = [CABasicAnimation animation];
    anim.keyPath = @"transform.scale";
    anim.fromValue = fromScale;
    anim.toValue = toScale;
    anim.duration = duration;
    anim.timingFunction = [timingFunction function];
    anim.removedOnCompletion = false;
    anim.fillMode = kCAFillModeForwards;

    _rippleLayer.opacity = 1;
    _backgroundLayer.opacity = 1;

    [_rippleLayer addAnimation:anim forKey:nil];
}

- (void)animateHideCircleLayer:(MKTimingFunction *)timingFunc
                      duration:(CFTimeInterval)duration
{
    [self animateAlphaForLayer:_rippleLayer
                    timingFunc:timingFunc
                      duration:duration];
    [self animateAlphaForLayer:_backgroundLayer
                    timingFunc:timingFunc
                      duration:duration];
}

- (void)animateAlphaForLayer:(CALayer *)layer
                  timingFunc:(MKTimingFunction *)timingFunc
                    duration:(CFTimeInterval)duration
{
    if (!layer) {
        return;
    }

    layer.opacity = 0;
    CABasicAnimation *anim = [CABasicAnimation animation];
    anim.keyPath = @"opacity";
    anim.fromValue = @1.0;
    anim.toValue = @0.0;
    anim.duration = duration;
    anim.timingFunction = [timingFunc function];
    [layer addAnimation:anim forKey:nil];
}

- (void)animateAlphaForBackgroundLayer:(MKTimingFunction*)timingFunction
                              duration:(CFTimeInterval)duration {
    [self animateAlphaForLayer:_backgroundLayer
                    timingFunc:timingFunction
                      duration:duration];
}

- (void)animateSuperLayerShadow:(id)fromRadius
                       toRadius:(id)toRadius
                    fromOpacity:(id)fromOpacity
                      toOpacity:(id)toOpacity
                 timingFunction:(MKTimingFunction*)timingFunction
                       duration:(CFTimeInterval)duration {
    [self animateShadowForLayer:_superLayer
                     fromRadius:fromRadius
                       toRadius:toRadius
                    fromOpacity:fromOpacity
                      toOpacity:toOpacity
                 timingFunction:timingFunction
                       duration: duration];
}

- (void)animateShadowForLayer:(CALayer*)layer
                   fromRadius:(id)fromRadius
                     toRadius:(id)toRadius
                  fromOpacity:(id)fromOpacity
                    toOpacity:(id)toOpacity
               timingFunction:(MKTimingFunction*)timingFunction
                     duration:(CFTimeInterval)duration {
    layer.shadowOpacity = ((NSNumber*) toOpacity).doubleValue;
    layer.shadowRadius  = ((NSNumber*) toRadius).doubleValue;

    CABasicAnimation *radiusAnim = [CABasicAnimation animation];
    radiusAnim.keyPath = @"shadowRadius";
    radiusAnim.fromValue = fromRadius;
    radiusAnim.toValue = toRadius;
    
    CABasicAnimation *opacityAnim = [CABasicAnimation animation];
    opacityAnim.keyPath = @"shadowOpacity";
    opacityAnim.fromValue = fromOpacity;
    opacityAnim.toValue = toOpacity;
    
    CAAnimationGroup *groupAnim = [[CAAnimationGroup alloc] init];
    groupAnim.duration = duration;
    groupAnim.timingFunction = [timingFunction function];
    groupAnim.removedOnCompletion = false;
    groupAnim.fillMode = kCAFillModeForwards;
    groupAnim.animations = @[radiusAnim, opacityAnim];
    
    [layer addAnimation:groupAnim forKey:nil];
}

- (void)animateMaskLayerShadow {

}

@end


@implementation MKLayerSupport {
    UIView *_view;
    UIColor *_defaultRippleColor;
}

@synthesize mkLayer = _mkLayer;
@synthesize maskEnabled;
@synthesize rippleEnabled;
@synthesize rippleLocation;
@synthesize rippleLocationByName;
@synthesize ripplePercent;
@synthesize backgroundLayerCornerRadius;
@synthesize cornerRadius;
@synthesize backgroundAniEnabled;
@synthesize rippleLayerColor;
@synthesize backgroundLayerColor;
@synthesize rippleAniTimingFunctionByName;

- (instancetype)initWithUIView:(UIView *)view {
    if (self = [super init]) {
        _view = view;
        [self setupLayer];
    }
    return self;
}

- (void)setupLayer {
    _defaultRippleColor = [UIColor colorWithWhite:1 alpha:0.125];

    // default properties
    self.maskEnabled = true;
    self.ripplePercent = 2;
    self.rippleLocation = MKRippleTapLocation;
    self.cornerRadius = 2;
    
    self.shadowAniEnabled = true;
    self.backgroundAniEnabled = true;
    self.rippleAniDuration = 0.35;
    self.backgroundAniDuration = 0.2;
    self.shadowAniDuration = 0.2;
    self.rippleAniTimingFunction = MKTimingLinear;
    self.backgroundAniTimingFunction = MKTimingLinear;
    self.shadowAniTimingFunction = MKTimingEaseOut;
    
    self.rippleLayerColor = _defaultRippleColor;
    self.backgroundLayerColor = _defaultRippleColor;
}

- (RCTMKLayer *)mkLayer {
    if (!_mkLayer) {
        _mkLayer = [[RCTMKLayer alloc] initWithSuperLayer:_view.layer];
    }
    
    return _mkLayer;
}

- (void)setMaskEnabled:(BOOL)enabled {
    maskEnabled = enabled;
    [self.mkLayer enableMask:enabled];
}

- (BOOL)maskEnabled {
    return maskEnabled;
}

- (void)setRippleEnabled:(BOOL)enabled {
    rippleEnabled = enabled;
    [self.mkLayer enableRipple:enabled];
    self.rippleLayerColor = self.rippleLayerColor ? self.rippleLayerColor : _defaultRippleColor;
    self.backgroundLayerColor = self.backgroundLayerColor ? self.backgroundLayerColor : _defaultRippleColor;
}

- (BOOL)rippleEnabled {
    return rippleEnabled;
}

- (void)setShadowPathEnabled:(BOOL)enabled {
    self.mkLayer.shadowPathEnabled = enabled;
}

- (BOOL)shadowPathEnabled {
    return self.mkLayer.shadowPathEnabled;
}

- (void)setRippleLocation:(MKRippleLocation)location {
    rippleLocation = location;
    self.mkLayer.rippleLocation = location;
}

- (MKRippleLocation)rippleLocation {
    return rippleLocation;
}

- (void)setRippleLocationByName:(NSString *)name {
    if ([@"tapLocation" isEqual:name]) {
        self.rippleLocation = MKRippleTapLocation;
    } else if ([@"center" isEqual:name]) {
        self.rippleLocation = MKRippleCenter;
    } else if ([@"left" isEqual:name]) {
        self.rippleLocation = MKRippleLeft;
    } else if ([@"right" isEqual:name]) {
        self.rippleLocation = MKRippleRight;
    } else {
        NSLog(@"unknown ripple location: %@", name);
    }
}

- (NSString*)rippleLocationByName {
    return nil;
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

- (void)setBackgroundAniEnabled:(BOOL)enabled {
    backgroundAniEnabled = enabled;
    if (!backgroundAniEnabled) {
        [self.mkLayer enableOnlyCircleLayer];
    }
}

- (BOOL)backgroundAniEnabled {
    return backgroundAniEnabled;
}

- (void)setRippleAniTimingFunctionByName:(NSString *)name {
    if ([@"linear" isEqual:name]) {
        self.rippleAniTimingFunction = MKTimingLinear;
    } else if ([@"easeIn" isEqual:name]) {
        self.rippleAniTimingFunction = MKTimingEaseIn;
    } else if ([@"easeOut" isEqual:name]) {
        self.rippleAniTimingFunction = MKTimingEaseOut;
    } else {
        NSLog(@"unkonwn timing function name: %@", name);
    }
}

- (NSString*)rippleAniTimingFunctionByName {
    return self.rippleAniTimingFunction.name;
}

- (void)setCornerRadius:(float)radius {
    cornerRadius = radius;
    _view.layer.cornerRadius = radius;
    self.backgroundLayerCornerRadius = radius;
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

- (void)animateShowRippleAt:(CGPoint)location
{
    if (self.rippleLocation == MKRippleTapLocation) {
        [self.mkLayer didChangeTapLocation:location];
    }
    
    // rippleLayer animation
    [self.mkLayer animateScaleForCircleLayer:@0.08
                                     toScale:@1.0
                              timingFunction:self.rippleAniTimingFunction
                                    duration:self.rippleAniDuration];
}

- (void)animateHideRipple
{
    [self.mkLayer animateHideCircleLayer:self.rippleAniTimingFunction
                                duration:self.rippleAniDuration];
}

- (void)animatePressedShadow
{
    [self animateShadowWithDiff:1.5 dOpacity:0.15];
}

- (void)animateRestoreShadow
{
    [self animateShadowWithDiff:-1.5 dOpacity:-0.15];
}

- (void)animateShadowWithDiff:(CGFloat)dRadius
                     dOpacity:(CGFloat)dOpacity
{
    if (!self.shadowAniEnabled) {
        return;
    }
    
    CGFloat radius    = _view.layer.shadowRadius;
    CGFloat toRadius  = radius + dRadius;
    CGFloat opacity   = _view.layer.shadowOpacity;
    CGFloat toOpacity = opacity + dOpacity;
    [self.mkLayer animateSuperLayerShadow:[NSNumber numberWithDouble:radius]
                                 toRadius:[NSNumber numberWithDouble:toRadius]
                              fromOpacity:[NSNumber numberWithDouble:opacity]
                                toOpacity:[NSNumber numberWithDouble:toOpacity]
                           timingFunction:self.shadowAniTimingFunction
                                 duration:self.shadowAniDuration];
}

@end
