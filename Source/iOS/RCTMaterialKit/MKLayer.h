//
//  MKLayer.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/6/6.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#ifndef RCTMaterialKit_MKLayer_h
#define RCTMaterialKit_MKLayer_h

@import UIKit;

typedef NS_ENUM(short, MKRippleLocation) {
    MKRippleTapLocation,
    MKRippleCenter,
    MKRippleLeft,
    MKRippleRight
};

@interface MKTimingFunction : NSObject
@property NSString *name;
@property float c1x;
@property float c1y;
@property float c2x;
@property float c2y;

+ (instancetype)linear;
+ (instancetype)easeIn;
+ (instancetype)easeOut;
+ (instancetype)customize:(float)c1x :(float)c1y :(float)c2x :(float)c2y;

- (CAMediaTimingFunction*)function;
@end

#define MKTimingLinear [MKTimingFunction linear]
#define MKTimingEaseIn [MKTimingFunction easeIn]
#define MKTimingEaseOut [MKTimingFunction easeOut]


@interface RCTMKLayer : NSObject

extern NSString *const RCTPasteboardChangedNotification;
extern NSString *const RCTPasteboardWatcherWillExpireNotification;

@property MKRippleLocation rippleLocation;
@property float ripplePercent;

- (id)initWithSuperLayer:(CALayer *)superLayer;

- (void)setCircleLayerLocationAt:(CGPoint)center;
- (void)superLayerDidResize;
- (void)enableOnlyCircleLayer;
- (void)setBackgroundLayerColor:(UIColor*)color;
- (void)setCircleLayerColor:(UIColor*)color;
- (void)didChangeTapLocation:(CGPoint)location;
- (void)setMaskLayerCornerRadius:(float)cornerRadius;
- (void)enableMask;
- (void)enableMask:(BOOL)enable;
- (void)setBackgroundLayerCornerRadius:(CGFloat)cornerRadius;
- (void)animateScaleForCircleLayer:(id)fromScale
                           toScale:(id)toScale
                    timingFunction:(MKTimingFunction*)timingFunction
                          duration:(CFTimeInterval)duration;
- (void)animateAlphaForBackgroundLayer:(MKTimingFunction*)timingFunction
                              duration:(CFTimeInterval)duration;
- (void)animateSuperLayerShadow:(id)fromRadius
                       toRadius:(id)toRadius
                    fromOpacity:(id)fromOpacity
                      toOpacity:(id)toOpacity
                 timingFunction:(MKTimingFunction*)timingFunction
                       duration:(CFTimeInterval)duration;
- (void)animateMaskLayerShadow;
@end

#endif
