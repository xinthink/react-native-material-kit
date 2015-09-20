//
//  MKSwitchManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/27.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKToggleViewManager.h"
#import "MKSwitch.h"

@interface MKSwitchManager : MKToggleViewManager
@end

@implementation MKSwitchManager

RCT_EXPORT_MODULE()

- (UIView*)view
{
    MKSwitch *view = [[MKSwitch alloc] init];
    view.delegate = self;
    return view;
}

RCT_EXPORT_VIEW_PROPERTY(checked, BOOL)
RCT_EXPORT_VIEW_PROPERTY(thumbRadius, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(onColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(offColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(thumbOnColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(thumbOffColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(rippleLayerColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(rippleColor, rippleLayerColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(slidingAniDuration, CGFloat)

@end
