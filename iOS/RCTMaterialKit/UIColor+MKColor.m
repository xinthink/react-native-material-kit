//
//  UIColor+MKColor.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/24.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "UIColor+MKColor.h"

@implementation UIColor (MKColor)

+ (UIColor *)colorWithHex:(int)hex
{
    CGFloat a = ((hex >> 24) & 0xFF) / 255.0f;
    CGFloat r = ((hex >> 16) & 0xFF) / 255.0f;
    CGFloat g = ((hex >> 8) & 0xFF) / 255.0f;
    CGFloat b = (hex & 0xFF) / 255.0f;
    return [UIColor colorWithRed:r green:g blue:b alpha:a];
}

+ (instancetype)solidColorWithHex:(int)hex
{
    return [UIColor colorWithHex:hex alpha:1];
}

+ (instancetype)colorWithHex:(int)hex alpha:(CGFloat)alpha
{
    CGFloat r = ((hex & 0xFF0000) >> 16) / 255.0f;
    CGFloat g = ((hex & 0x00FF00) >> 8) / 255.0f;
    CGFloat b = (hex & 0x0000FF) / 255.0f;
    return [UIColor colorWithRed:r green:g blue:b alpha:alpha];
}

+ (instancetype)transparent
{
    static UIColor *color = nil;

    if (!color) {
        color = [UIColor colorWithWhite:0 alpha:0];
    }

    return color;
}

+ (instancetype)indigo
{
    static UIColor *color = nil;

    if (!color) {
        color = [UIColor solidColorWithHex:MK_COLOR_INDIGO];
    }

    return color;
}

+ (instancetype)silver
{
    static UIColor *color = nil;

    if (!color) {
        color = [UIColor solidColorWithHex:MK_COLOR_SILVER];
    }

    return color;
}

@end
