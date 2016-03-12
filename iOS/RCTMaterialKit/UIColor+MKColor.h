//
//  UIColor+MKColor.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/24.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import <UIKit/UIKit.h>

#define MK_COLOR_RED 0xFF5252
#define MK_COLOR_PINK 0xFF4081
#define MK_COLOR_PURPLE 0x9C27B0
#define MK_COLOR_DEEPPURPLE 0x67AB7
#define MK_COLOR_INDIGO 0x3F51B5
#define MK_COLOR_BLUE 0x2196F3
#define MK_COLOR_LIGHTBLUE 0x03A9F4
#define MK_COLOR_CYAN 0x00BCD4
#define MK_COLOR_TEAL 0x009688
#define MK_COLOR_GREEN 0x4CAF50
#define MK_COLOR_LIGHTGREEN 0x8BC34A
#define MK_COLOR_LIME 0xCDDC39
#define MK_COLOR_YELLOW 0xFFEB3B
#define MK_COLOR_AMBER 0xFFC107
#define MK_COLOR_ORANGE 0xFF9800
#define MK_COLOR_DEEPORANGE 0xFF5722
#define MK_COLOR_BROWN 0x795548
#define MK_COLOR_GREY 0x9E9E9E
#define MK_COLOR_BLUEGREY 0x607D8B

#define MK_COLOR_SILVER 0xEAEAEA

@interface UIColor (MKColor)

+ (instancetype)colorWithHex:(int)hex;
+ (instancetype)solidColorWithHex:(int)hex;
+ (instancetype)colorWithHex:(int)hex alpha:(CGFloat)alpha;

+ (instancetype)transparent;
+ (instancetype)indigo;
+ (instancetype)silver;

@end
