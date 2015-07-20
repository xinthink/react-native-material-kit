//
//  MKUtils.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#ifndef RCTMaterialKit_MKUtils_h
#define RCTMaterialKit_MKUtils_h

@import Foundation;

static inline NSString* trim(NSString *str) {
    return [str stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
}

static inline BOOL isBlank(NSString *str) {
    return str == Nil || trim(str).length == 0;
}

static inline BOOL isNotBlank(NSString *str) {
    return !isBlank(str);
}

static inline BOOL isEqual(CGFloat a, CGFloat b) {
    return fabs(a - b) <= 1E-6;
}

static inline BOOL isNotEqual(CGFloat a, CGFloat b) {
    return !isEqual(a, b);
}

#endif
