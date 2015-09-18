//
//  MKButtonManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/7.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKButton.h"
#import "RCTViewManager.h"

@interface MKButtonManager : RCTViewManager
@end

@implementation MKButtonManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[MKButton alloc] init];
}

RCT_REMAP_VIEW_PROPERTY(shadowColor, layer.shadowColor, CGColor);
RCT_REMAP_VIEW_PROPERTY(shadowOffset, layer.shadowOffset, CGSize);
RCT_REMAP_VIEW_PROPERTY(shadowOpacity, layer.shadowOpacity, float);
RCT_REMAP_VIEW_PROPERTY(shadowRadius, layer.shadowRadius, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(shadowPathEnabled, BOOL);

RCT_EXPORT_VIEW_PROPERTY(cornerRadius, float);
RCT_EXPORT_VIEW_PROPERTY(maskEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerCornerRadius, float);
RCT_EXPORT_VIEW_PROPERTY(backgroundAniEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(ripplePercent, float);
RCT_EXPORT_VIEW_PROPERTY(rippleLayerColor, UIColor);
RCT_REMAP_VIEW_PROPERTY(rippleAniTimingFunction, rippleAniTimingFunctionByName, NSString);
RCT_REMAP_VIEW_PROPERTY(rippleLocation, rippleLocationByName, NSString);

@end