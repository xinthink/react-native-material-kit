//
//  MKToggleViewManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/26.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKToggleViewManager.h"

@implementation MKToggleViewManager

RCT_EXPORT_MODULE()  // don't export 'abstract' class?

#pragma mark - MKToggleViewDelegate

- (void)toggleView:(UIView<MKToggle>*)view didToggled:(BOOL)checked
{
    [self.bridge.eventDispatcher sendInputEventWithName:@"topChange"
                                                   body:@{@"target": view.reactTag,
                                                          @"checked": @(checked), }];
}

@end