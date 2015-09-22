//
//  MKTouchableManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/9/22.
//  Copyright © 2015年 xinthink. All rights reserved.
//

#import "RCTViewManager.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"
#import "MKTouchable.h"

@interface MKTouchableManager : RCTViewManager <MKTouchableDelegate>
@end

@implementation MKTouchableManager

RCT_EXPORT_MODULE()

- (UIView*)view
{
    MKTouchable *view = [[MKTouchable alloc] init];
    view.delegate = self;
    return view;
}

#pragma mark - MKToggleViewDelegate

- (void)touchable:(MKTouchable *)view touchesBegan:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_DOWN" touch:touch source:view];
}

- (void)touchable:(MKTouchable *)view touchesMoved:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_MOVE" touch:touch source:view];
}

- (void)touchable:(MKTouchable *)view touchesEnded:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_UP" touch:touch source:view];
}

- (void)touchable:(MKTouchable *)view touchesCancelled:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_CANCEL" touch:touch source:view];
}

- (void)sendTouchEvent:(NSString*)type touch:(UITouch*)touch source:(MKTouchable*)source
{
    CGPoint location = [touch locationInView:source];
    NSDictionary *dict = @{
                           @"target": source.reactTag,
                           @"type": type,
                           @"x": [NSNumber numberWithFloat:location.x],
                           @"y": [NSNumber numberWithFloat:location.y],
                           };
    [self.bridge.eventDispatcher sendInputEventWithName:@"topChange" body:dict];
}

@end
