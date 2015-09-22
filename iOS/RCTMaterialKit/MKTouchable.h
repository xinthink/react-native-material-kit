//
//  MKTouchable.h
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/9/22.
//  Copyright © 2015年 xinthink. All rights reserved.
//

#ifndef MKTouchable_h
#define MKTouchable_h

#import "RCTView.h"

@class MKTouchable;
@protocol MKTouchableDelegate;

/*
 * The touchable component
 */
@interface MKTouchable : RCTView

@property (nonatomic, weak) id<MKTouchableDelegate> delegate;

@end

/*
 * Touche events delegate
 */
@protocol MKTouchableDelegate <NSObject>

@required
- (void)touchable:(MKTouchable*)view touchesBegan:(UITouch*)touch;

@required
- (void)touchable:(MKTouchable *)view touchesMoved:(UITouch *)touch;

@required
- (void)touchable:(MKTouchable *)view touchesEnded:(UITouch *)touch;

@required
- (void)touchable:(MKTouchable *)view touchesCancelled:(UITouch *)touch;

@end

#endif /* MKTouchable_h */
