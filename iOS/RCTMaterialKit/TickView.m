//
//  TickView.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/12/20.
//  Copyright © 2015年 https://github.com/xinthink. All rights reserved.
//

#import "math.h"

#import "TickView.h"
#import "UIColor+MKColor.h"

@implementation TickView
{
    UIColor *_fillColor;
    UIBezierPath *tickPath;
}

@synthesize inset;

- (instancetype)init {
    if (self = [super init]) {
        [self initDefaults];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self initDefaults];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        [self initDefaults];
    }
    return self;
}

- (void)initDefaults
{
    self.inset = 1;
    _fillColor = [UIColor indigo];
    [self setOpaque:false];
}

- (void)drawRect:(CGRect)rect
{
    if (!tickPath) {
        [self updateTickPathWithRect:rect];
    }

    [_fillColor setFill];
    [tickPath fill];

}

#pragma mark - Custom Accessors

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    [self updateTickPathWithRect:bounds];
    [self setNeedsDisplay];
}

- (void)setFillColor:(int)color
{
    _fillColor = [UIColor colorWithHex:color];
    [self setNeedsDisplay];
}

- (void)setInset:(float)anInset
{
    inset = anInset;
    [self setNeedsDisplay];
}

- (float)inset
{
    return inset;
}

#pragma mark - Private

- (void)updateTickPathWithRect:(CGRect)rect
{
//    NSLog(@"updating tick within rect: %@", NSStringFromCGRect(rect));
    CGFloat left = CGRectGetMinX(rect);
    CGFloat right = CGRectGetMaxX(rect);
    CGFloat top = CGRectGetMinY(rect);
    CGFloat bottom = CGRectGetMaxY(rect);

    CGFloat extraBottomInset = 1;  // #117 Leaving 1px gap from bottom (2px will make the tick too thin)
    CGFloat width = right - left;
    CGFloat baseSize = width / 3;  // choose a box at the left bottom corner which defines the width of the tick
    CGFloat tickBottomY = bottom - self.inset - extraBottomInset;
    CGFloat tickWidth = (baseSize - self.inset - extraBottomInset) / M_SQRT2;
    CGFloat a = tickWidth / M_SQRT2;
    CGFloat x0 = left + self.inset;
    CGFloat y0 = tickBottomY - (baseSize - self.inset);

    tickPath = [UIBezierPath bezierPathWithRect:rect];
    tickPath.usesEvenOddFillRule = YES;
    tickPath.lineWidth = 2;
    [tickPath moveToPoint:CGPointMake(x0, y0)];
    [tickPath addLineToPoint:CGPointMake(x0 + a, y0 - a)];
    [tickPath addLineToPoint:CGPointMake(baseSize, bottom - baseSize)];
    [tickPath addLineToPoint:CGPointMake(right - a - self.inset, top + a + self.inset)];
    [tickPath addLineToPoint:CGPointMake(right - self.inset, top + 2 * a + self.inset)];
    [tickPath addLineToPoint:CGPointMake(baseSize, tickBottomY)];
}

@end
