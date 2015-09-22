//
//  MKTouchable.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/9/22.
//  Copyright © 2015年 xinthink. All rights reserved.
//

#import "MKTouchable.h"

@implementation MKTouchable

#pragma mark - Touch event handling

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate touchable:self touchesBegan:touch];
    }
    [super touchesBegan:touches withEvent:event];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate touchable:self touchesEnded:touch];
    }
    [super touchesEnded:touches withEvent:event];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate touchable:self touchesMoved:touch];
    }
    [super touchesMoved:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate touchable:self touchesCancelled:touch];
    }
    [super touchesCancelled:touches withEvent:event];
}

@end
