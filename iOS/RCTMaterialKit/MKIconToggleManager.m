//
//  MKIconToggleManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/25.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKToggleViewManager.h"
#import "MKIconToggle.h"

@interface MKIconToggleManager : MKToggleViewManager
@end

@implementation MKIconToggleManager

RCT_EXPORT_MODULE()

- (UIView*)view
{
    MKIconToggle *view = [[MKIconToggle alloc] init];
    view.delegate = self;
    return view;
}

RCT_EXPORT_VIEW_PROPERTY(checked, BOOL)
RCT_EXPORT_VIEW_PROPERTY(insets, UIEdgeInsets)

@end
