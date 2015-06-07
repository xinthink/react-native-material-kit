//
//  MKButton.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

@import UIKit;
#import "MKLayer.h"

@interface MKButton : UIButton {
    MKLayer *_mkLayer;
}

@property BOOL maskEnabled;

- (MKLayer *)mkLayer;

@end

@implementation MKButton

- (MKLayer *)mkLayer; {
    if (!_mkLayer) {
        _mkLayer = [[MKLayer alloc] initWithSuperLayer:self.layer];
    }
    
    return _mkLayer;
}

@end
