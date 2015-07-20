//
//  MKTextField.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/10.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKTextField.h"

@implementation MKTextField {
    MKLayerSupport *_mkLayerSupport;
    UILabel *_floatingLabel;
    CALayer *_bottomBorderLayer;
}

@synthesize padding;
@synthesize bottomBorderEnabled;

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
    [_mkLayerSupport.mkLayer onResized:^(CGRect bounds) {
        [self updateBottomLayerSize:bounds];
    }];
    
    // default properties
    self.layer.borderWidth = 1;
    self.borderStyle = UITextBorderStyleNone;
    
    self.padding = CGSizeMake(5, 5);
    self.floatingLabelBottomMargin = 2;
    self.floatingPlaceholderEnabled = false;
    self.bottomBorderWidth = 1;
    self.bottomBorderHighlightWidth = 1.75;
    self.bottomBorderColor = [UIColor lightGrayColor];
    
    // floating label
    _floatingLabel = [[UILabel alloc] init];
    self.floatingLabelFont = [UIFont boldSystemFontOfSize:10];
    self.floatingLabelTextColor = [UIColor lightGrayColor];
    _floatingLabel.alpha = 0.0;
    [self updateFloatingLabelText];
    [self addSubview:_floatingLabel];
}

- (void)setBottomBorderEnabled:(BOOL)enabled {
    bottomBorderEnabled = enabled;
    [self removeBottomLayer];
    
    if (enabled) {
        _bottomBorderLayer = [[CALayer alloc] init];
        CGRect initSize = CGRectMake(0, CGRectGetHeight(self.bounds) - 1, CGRectGetWidth(self.bounds), 1);
        [self updateBottomLayerSize:initSize];
//        _bottomBorderLayer?.backgroundColor = UIColor.MKColor.Grey.CGColor  // TODO MKColor
        _bottomBorderLayer.backgroundColor = [[UIColor lightGrayColor] CGColor];
        [self.layer addSublayer:_bottomBorderLayer];
    }
}

- (BOOL)bottomBorderEnabled {
    return bottomBorderEnabled;
}

- (void)updateBottomLayerSize:(CGRect)bounds {
    _bottomBorderLayer.frame = bounds;
}

- (void)removeBottomLayer {
    if (_bottomBorderLayer) {
        [_bottomBorderLayer removeFromSuperlayer];
        _bottomBorderLayer = nil;
    }
}

- (void)setFloatingLabelFont:(UIFont *)font {
    _floatingLabel.font = font;
}

- (UIFont*)floatingLabelFont {
    return _floatingLabel.font;
}

- (void)setPlaceholder:(NSString *)placeholder {
    [super setPlaceholder:placeholder];
    [self updateFloatingLabelText];
}

- (void)updateFloatingLabelText {
    _floatingLabel.text = self.placeholder;
    [_floatingLabel sizeToFit];
    [self setFloatingLabelOverlapTextField];
}

- (void)setFloatingLabelOverlapTextField {
    CGRect textRect = [self textRectForBounds:self.bounds];
    CGFloat originX = textRect.origin.x;
    CGFloat textWidth = CGRectGetWidth(textRect);
    CGFloat labelWidth = CGRectGetWidth(_floatingLabel.bounds);
    switch (self.textAlignment) {
        case NSTextAlignmentCenter:
            originX += textWidth/2 - labelWidth/2;
        case NSTextAlignmentRight:
            originX += textWidth - labelWidth;
        default:
            break;
    }
    _floatingLabel.frame = CGRectMake(originX, padding.height,
                                      CGRectGetWidth(_floatingLabel.frame),
                                      CGRectGetHeight(_floatingLabel.frame));
}

- (void)showFloatingLabel {
    CGRect curFrame = _floatingLabel.frame;
    _floatingLabel.frame = CGRectMake(curFrame.origin.x, CGRectGetHeight(self.bounds)/2,
                                      CGRectGetWidth(curFrame), CGRectGetHeight(curFrame));
    [UIView animateWithDuration:0.45
                          delay:0.0
                        options:UIViewAnimationOptionCurveEaseIn
                     animations:^{
                         _floatingLabel.alpha = 1.0;
                         _floatingLabel.frame = curFrame;
                     }
                     completion: nil];
}

- (void)hideFloatingLabel {
    _floatingLabel.alpha = 0.0;
}

- (CGRect)textRectForBounds:(CGRect)bounds {
    CGRect rect = [super textRectForBounds:bounds];
    CGRect newRect = CGRectMake(rect.origin.x + padding.width, rect.origin.y,
                                rect.size.width - 2 * padding.width, rect.size.height);
    
    if (!_floatingPlaceholderEnabled) {
        return newRect;
    }
    
    if (isNotBlank(self.text)) {
        CGFloat dTop = _floatingLabel.font.lineHeight + _floatingLabelBottomMargin;
        newRect = UIEdgeInsetsInsetRect(newRect, UIEdgeInsetsMake(dTop, 0, 0, 0));
    }
    return newRect;
}

- (CGRect)editingRectForBounds:(CGRect)bounds {
    return [self textRectForBounds:bounds];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    if (!self.floatingPlaceholderEnabled) {
        return;
    }
    
    BOOL isFirstRsp = [self isFirstResponder];
    if (isNotBlank(self.text)) {
        _floatingLabel.textColor = isFirstRsp ? self.tintColor : self.floatingLabelTextColor;
        if (isEqual(_floatingLabel.alpha, 0)) {
            [self showFloatingLabel];
        }
    } else {
        [self hideFloatingLabel];
    }
    
    if (!_bottomBorderLayer) {
        return;
    }
    _bottomBorderLayer.backgroundColor = isFirstRsp ? self.tintColor.CGColor : self.bottomBorderColor.CGColor;
    CGFloat borderWidth = isFirstRsp ? self.bottomBorderHighlightWidth : self.bottomBorderWidth;
    [self updateBottomLayerSize:CGRectMake(0,
                                           CGRectGetHeight(self.layer.bounds) - borderWidth,
                                           CGRectGetWidth(self.layer.bounds),
                                           borderWidth)];
    
}

- (BOOL)beginTrackingWithTouch:(UITouch *)touch
                     withEvent:(UIEvent *)event {
    RCTMKLayer *mkLayer = _mkLayerSupport.mkLayer;
    [mkLayer didChangeTapLocation:[touch locationInView:self]];
    
    [mkLayer animateScaleForCircleLayer:@0.45
                                toScale:@1.0
                         timingFunction:MKTimingLinear
                               duration:self.rippleAniDuration];
    [mkLayer animateAlphaForBackgroundLayer:MKTimingLinear
                                   duration:self.backgroundAniDuration];
    
    return [super beginTrackingWithTouch:touch
                               withEvent:event];
}

// ---------------------------
// Common MKLayer properties

- (void)setMaskEnabled:(BOOL)enabled {
    _mkLayerSupport.maskEnabled = enabled;
}

- (BOOL)maskEnabled {
    return _mkLayerSupport.maskEnabled;
}

- (void)setRippleEnabled:(BOOL)enabled {
    _mkLayerSupport.rippleEnabled = enabled;
}

- (BOOL)rippleEnabled {
    return _mkLayerSupport.rippleEnabled;
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

@end
