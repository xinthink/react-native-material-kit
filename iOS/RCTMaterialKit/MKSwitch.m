//
//  MKSwitch.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/27.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKSwitch.h"
#import "UIColor+MKColor.h"

@implementation MKSwitchThumb
{
    MKLayerSupport *_mkLayerSupport;
}

@synthesize rippleRadius;

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
    self.onColor = [UIColor indigo];
    self.offColor = [UIColor silver];
    self.backgroundColor = self.offColor;

    self.layer.shadowRadius = 1;
    self.layer.shadowOffset = CGSizeMake(0, 1);
    self.layer.shadowOpacity = 0.5;
    self.layer.shadowColor = [UIColor blackColor].CGColor;

    self.rippleRadius = 20;
    _mkLayerSupport.backgroundAniEnabled = false;
    _mkLayerSupport.rippleLocation = MKRippleCenter;
    self.rippleLayerColor = [UIColor colorWithWhite:0.45 alpha:0.3];
    self.rippleAniDuration = 0.3;
    self.rippleAniTimingFunction = MKTimingEaseIn;
}

# pragma mark - Custom accessors

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    [self onResized];
}

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    [self onResized];
}

- (void)onResized
{
    CGFloat w = CGRectGetWidth(self.bounds);
    CGFloat h = CGRectGetHeight(self.bounds);
    CGFloat r = MAX(w, h) / 2;

    self.layer.cornerRadius = r;

    if (r > 0 && self.rippleRadius > r) {
        _mkLayerSupport.ripplePercent = self.rippleRadius / r;
    } else {
        _mkLayerSupport.ripplePercent = 2;
    }
}

- (void)setRippleRadius:(float)radius
{
    rippleRadius = radius;
    [self onResized];
}

- (float)rippleRadius
{
    return rippleRadius;
}

#pragma mark - Common MKLayer properties

- (float)rippleAniDuration
{
    return _mkLayerSupport.rippleAniDuration;
}

- (void)setRippleAniDuration:(float)duration
{
    _mkLayerSupport.rippleAniDuration = duration;
}

- (float)shadowAniDuration
{
    return _mkLayerSupport.shadowAniDuration;
}

- (void)setShadowAniDuration:(float)duration
{
    _mkLayerSupport.shadowAniDuration = duration;
}

- (MKTimingFunction*)rippleAniTimingFunction
{
    return _mkLayerSupport.rippleAniTimingFunction;
}

- (void)setRippleAniTimingFunction:(MKTimingFunction*)timingFunc
{
    _mkLayerSupport.rippleAniTimingFunction = timingFunc;
}

- (MKTimingFunction*)shadowAniTimingFunction
{
    return _mkLayerSupport.shadowAniTimingFunction;
}

- (void)setShadowAniTimingFunction:(MKTimingFunction *)timingFunc
{
    _mkLayerSupport.shadowAniTimingFunction = timingFunc;
}

// color
- (UIColor*)rippleLayerColor
{
    return _mkLayerSupport.rippleLayerColor;
}

- (void)setRippleLayerColor:(UIColor *)color
{
    _mkLayerSupport.rippleLayerColor = color;
}

# pragma mark - Switch actions

- (void)startToggleFromState:(BOOL)checked
{
    [_mkLayerSupport animateShowRippleAt:CGPointZero];
}

- (void)confirmToggleFromState:(BOOL)checked
{
    [_mkLayerSupport animateHideRipple];
    self.backgroundColor = checked ? self.offColor : self.onColor;
}

- (void)cancelToggleFromState:(BOOL)checked
{
    [_mkLayerSupport animateHideRipple];
}

@end


@implementation MKSwitch
{
    MKSwitchThumb *_thumbView;
}

@synthesize checked;

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
    _thumbView = [[MKSwitchThumb alloc] init];
    [self addSubview:_thumbView];

    // default properties
    self.clipsToBounds = false;
    self.thumbRadius = 10;
    self.onColor = [UIColor colorWithHex:MK_COLOR_INDIGO alpha:0.4];
    self.offColor = [UIColor colorWithWhite:0 alpha:0.25];
    self.rippleLayerColor = [UIColor colorWithHex:MK_COLOR_INDIGO alpha:0.25];
    self.backgroundColor = self.offColor;
    self.slidingAniDuration = 0.3;
}

- (void)layoutSubviews
{
    [self onResized];
    self.backgroundColor = self.checked ? self.onColor : self.offColor;
    _thumbView.frame = [self computeThumbFrame];
}

- (CGRect)computeThumbFrame
{
    CGFloat cornerRadius = self.layer.cornerRadius;
    CGFloat thumbOriginX = self.checked ? CGRectGetWidth(self.bounds) - cornerRadius : cornerRadius;
    return CGRectMake(thumbOriginX - self.thumbRadius,
                                  cornerRadius - self.thumbRadius,
                                  CGRectGetWidth(_thumbView.bounds),
                                  CGRectGetHeight(_thumbView.bounds));
}

#pragma mark - Custom accessors

- (void)setChecked:(BOOL)isChecked
{
    [_thumbView confirmToggleFromState:checked];
    [self _internalSetChecked:isChecked];
    [self setNeedsDisplay];
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

- (UIColor*)thumbOnColor
{
    return _thumbView.onColor;
}

- (void)setThumbOnColor:(UIColor *)color
{
    _thumbView.onColor = color;
}

- (UIColor*)thumbOffColor
{
    return _thumbView.offColor;
}

- (void)setThumbOffColor:(UIColor *)color
{
    _thumbView.offColor = color;
}

- (UIColor*)rippleLayerColor
{
    return _thumbView.rippleLayerColor;
}

- (void)setRippleLayerColor:(UIColor *)color
{
    _thumbView.rippleLayerColor = color;
}

- (CGFloat)slidingAniDuration
{
    return _thumbView.rippleAniDuration;
}

- (void)setSlidingAniDuration:(CGFloat)duration
{
    _thumbView.rippleAniDuration = duration;
}

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    [self onResized];
}

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    [self onResized];
}

- (void)onResized
{
    self.layer.cornerRadius = CGRectGetHeight(self.bounds) / 2;
    [self updateThumbSize];
}

- (void)updateThumbSize
{
    _thumbView.bounds = CGRectMake(0, 0, self.thumbRadius * 2, self.thumbRadius * 2);
    _thumbView.rippleRadius = CGRectGetWidth(self.bounds) - self.layer.cornerRadius * 2;
}

# pragma mark - Switch actions

- (void)startToggle
{
    // start toggle animation
    [_thumbView startToggleFromState:checked];
}

- (void)confirmToggle
{
    // confirm toggle
    [_thumbView confirmToggleFromState:checked];
    [self _internalSetChecked:!checked];

    // sliding the thumb
    CGRect thumbDestRect = [self computeThumbFrame];
    [UIView animateWithDuration:self.slidingAniDuration
                     animations:^{
                         self.backgroundColor = checked ? self.onColor : self.offColor;
                         _thumbView.frame = thumbDestRect;
                     }
                     completion:nil];
}

- (void)cancelToggle
{
    // cancel animation
    [_thumbView cancelToggleFromState:checked];
}

#pragma mark - Touch event handling

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self startToggle];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self confirmToggle];
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self cancelToggle];
}

@end
