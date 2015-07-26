//
//  UIColor+MKColor.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/24.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIColor (MKColor)

+ (instancetype)colorWithHex:(int)hex;
+ (instancetype)colorWithHex:(int)hex alpha:(CGFloat)alpha;

+ (instancetype)transparent;

@end
