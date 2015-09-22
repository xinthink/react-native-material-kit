//
//  MKIconToggle.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/25.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKIconToggle.h"

@implementation MKIconToggle

#pragma mark - Lifecylce

- (void)setupLayer
{
    [super setupLayer];

    // toggle control
    self.toggleCtl.checkedHighlightEnabled = false;
    self.toggleCtl.layer.borderWidth = 0;

    // defaults
    self.insets = UIEdgeInsetsMake(10, 10, 10, 10);
}

- (void)layoutSubviews
{
    UIEdgeInsets insets = self.insets;
    CGFloat x0 = insets.left;
    CGFloat y0 = insets.top;
    CGFloat w  = CGRectGetWidth(self.bounds) - insets.left - insets.right;
    CGFloat h  = CGRectGetHeight(self.bounds) - insets.top - insets.bottom;

    self.toggleCtl.frame = CGRectMake(x0, y0, w, h);
}

@end
