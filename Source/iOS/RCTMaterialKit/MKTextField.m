//
//  MKTextField.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/10.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKTextField.h"
#import "MKUtils.h"

@implementation MKTextField
{
    MKLayerSupport *_mkLayerSupport;
    UILabel *_floatingLabel;
    CALayer *_bottomBorderLayer, *_bottomBorderHighlightLayer;
}

@synthesize padding;
@synthesize bottomBorderEnabled;

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
    [_mkLayerSupport.mkLayer onResized:^(CGRect bounds) {
        [self onResized:bounds];
    }];

    // default properties
    self.layer.borderWidth = 0;
    self.borderStyle = UITextBorderStyleNone;
    self.tintColor = [UIColor lightGrayColor];
    self.rippleEnabled = false;
    self.rippleLayerColor = [UIColor colorWithWhite:0.45 alpha:0.2];
    self.backgroundLayerColor = [UIColor colorWithWhite:0.75 alpha:0.2];
    self.rippleAniDuration = 0.35;
    self.ripplePercent = 1;

    self.padding = CGSizeMake(2, 2);
    self.floatingLabelBottomMargin = 2;
    self.floatingLabelEnabled = false;
    self.bottomBorderWidth = 1;
    self.highlightColor = [UIColor blueColor];
    self.bottomBorderEnabled = true;

    // floating label
    _floatingLabel = [[UILabel alloc] init];
    self.floatingLabelFont = [UIFont boldSystemFontOfSize:10];
    _floatingLabel.alpha = 0.0;
    [self addSubview:_floatingLabel];
//    self.placeholderFont = [UIFont boldSystemFontOfSize:12];
}

- (void)setBottomBorderEnabled:(BOOL)enabled
{
    bottomBorderEnabled = enabled;
    [self removeBottomLayer];

    if (enabled) {
        _bottomBorderLayer = [[CALayer alloc] init];
        [self onResized:self.bounds];
        _bottomBorderLayer.backgroundColor = self.tintColor.CGColor;
        [self.layer addSublayer:_bottomBorderLayer];

        _bottomBorderHighlightLayer = [[CALayer alloc] init];
        [self.layer addSublayer:_bottomBorderHighlightLayer];
    }
}

- (BOOL)bottomBorderEnabled
{
    return bottomBorderEnabled;
}

- (void)onResized:(CGRect)bounds
{
//    _placeholderBounds = [self placeholderRectForBounds:bounds];
    _bottomBorderLayer.frame = CGRectMake(0, CGRectGetHeight(bounds) - self.bottomBorderWidth,
                                          CGRectGetWidth(bounds), self.bottomBorderWidth);
}

- (void)animateBottomBorder
{
    BOOL isFirstRsp = [self isFirstResponder];
    CGRect bounds = _bottomBorderLayer.frame;
    CGRect destRect;
    CGPoint center = CGPointMake(CGRectGetWidth(bounds)/2, bounds.origin.y);

    if (isFirstRsp) {
        _bottomBorderHighlightLayer.frame = CGRectMake(center.x, center.y, 0, CGRectGetHeight(bounds));
        destRect = bounds;
    } else {
        _bottomBorderHighlightLayer.frame = bounds;
        destRect = CGRectMake(center.x, center.y, 0, CGRectGetHeight(bounds));
    }

    _bottomBorderHighlightLayer.backgroundColor = self.highlightColor.CGColor;
    [UIView animateWithDuration:.3
                          delay:0
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                         _bottomBorderHighlightLayer.frame = destRect;
                     }
                     completion: nil];
}

- (void)removeBottomLayer
{
    if (_bottomBorderLayer) {
        [_bottomBorderHighlightLayer removeFromSuperlayer];
        _bottomBorderHighlightLayer = nil;

        [_bottomBorderLayer removeFromSuperlayer];
        _bottomBorderLayer = nil;
    }
}

- (void)setFloatingLabelFont:(UIFont *)font
{
    _floatingLabel.font = font;
    [_floatingLabel sizeToFit];
}

- (UIFont*)floatingLabelFont
{
    return _floatingLabel.font;
}

- (void)setPlaceholder:(NSString *)placeholder
{
     super.placeholder = placeholder;
//    self.attributedPlaceholder = [[NSAttributedString alloc] initWithString:placeholder
//                                                                 attributes:@{NSForegroundColorAttributeName:[UIColor lightGrayColor],
//                                                                              NSFontAttributeName: self.placeholderFont}];
    [self updateFloatingLabelText:placeholder];
}

- (void)updateFloatingLabelText:(NSString*)text
{
    _floatingLabel.text = text;
    [_floatingLabel sizeToFit];
}

- (CGRect)getFloatingLabelFrame
{
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
    return CGRectMake(originX, padding.height,
                      CGRectGetWidth(_floatingLabel.frame),
                      CGRectGetHeight(_floatingLabel.frame));
}

- (CGRect)getPlaceholderFrame
{
    CGRect textRect = [self placeholderRectForBounds:self.bounds];
    CGFloat originX = textRect.origin.x;
    CGFloat textHeight = CGRectGetHeight(textRect);
    CGFloat labelHeight = CGRectGetHeight(_floatingLabel.bounds);
    CGFloat originY = textHeight/2 - labelHeight/2;
    return CGRectMake(originX, originY,
                      CGRectGetWidth(_floatingLabel.frame),
                      CGRectGetHeight(_floatingLabel.frame));
}

- (void)showFloatingLabel
{
    if (isNotEqual(_floatingLabel.alpha, 0)) {
        return;
    }

    _floatingLabel.frame = [self getPlaceholderFrame];
    _floatingLabel.textColor = [UIColor lightGrayColor];
    [self setPlaceholderColor:[UIColor colorWithWhite:0 alpha:0]];

    [UIView animateWithDuration:.3
                          delay:0
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                         _floatingLabel.alpha = 1;
                         _floatingLabel.frame = [self getFloatingLabelFrame];
                         _floatingLabel.textColor = self.highlightColor;
//                         _floatingLabel.font = self.floatingLabelFont;
                     }
                     completion:nil];
}

- (void)hideFloatingLabel
{
    if (isNotEqual(_floatingLabel.alpha, 1) || isNotBlank(self.text)) {
        return;
    }

    [UIView animateWithDuration:.3
                          delay:0
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                         _floatingLabel.alpha = 0;
                         _floatingLabel.frame = [self getPlaceholderFrame];
                         _floatingLabel.textColor = [UIColor lightGrayColor];
//                         _floatingLabel.font = self.placeholderFont;
                     }
                     completion:^(BOOL finished){
                         if (finished) {
                             [self setPlaceholderColor:[UIColor lightGrayColor]];
                         }
                     }];
}

- (void)setPlaceholderColor:(UIColor*)color
{
    self.attributedPlaceholder = [[NSAttributedString alloc] initWithString:self.placeholder
                                                                 attributes:@{NSForegroundColorAttributeName:color}];
}

- (CGRect)textRectForBounds:(CGRect)bounds
{
    CGRect rect = [super textRectForBounds:bounds];
    CGRect newRect = CGRectMake(rect.origin.x + padding.width, rect.origin.y,
                                rect.size.width - 2 * padding.width, rect.size.height);

    if (!_floatingLabelEnabled) {
        return newRect;
    }

    CGFloat dTop = _floatingLabel.font.lineHeight + _floatingLabelBottomMargin;
    newRect = UIEdgeInsetsInsetRect(newRect, UIEdgeInsetsMake(dTop, 0, 0, 0));
    return newRect;
}

- (CGRect)editingRectForBounds:(CGRect)bounds
{
    return [self textRectForBounds:bounds];
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    [self layoutFloatingLabel];

    if (_bottomBorderLayer) {
        [self animateBottomBorder];
    }
}

- (void)layoutFloatingLabel
{
    if (!self.floatingLabelEnabled) {
        return;
    }
    
    if ([self isFirstResponder]) {
        [self showFloatingLabel];
    } else {
        [self hideFloatingLabel];
    }
}

- (BOOL)beginTrackingWithTouch:(UITouch *)touch
                     withEvent:(UIEvent *)event {
    [_mkLayerSupport animateShowRippleAt:[touch locationInView:self]];
    [_mkLayerSupport animateHideRipple];
    return [super beginTrackingWithTouch:touch
                               withEvent:event];
}

// ---------------------------
// Common MKLayer properties

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

# pragma mark - Events

- (BOOL)resignFirstResponder
{
    BOOL result = [super resignFirstResponder];
    if (result) {
        [self sendActionsForControlEvents:UIControlEventTouchUpOutside];
    }
    return result;
}

@end
