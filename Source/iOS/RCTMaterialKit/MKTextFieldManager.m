//
//  MKTextFieldManager.m
//  RCTMaterialKit
//
//  Created by Yingxin Wu on 15/7/16.
//  Copyright (c) 2015年 xinthink. All rights reserved.
//

#import "MKTextField.h"
#import "RCTViewManager.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@interface MKTextFieldManager : RCTViewManager
@end

@implementation MKTextFieldManager

RCT_EXPORT_MODULE()

- (UIView*)view
{
    MKTextField *txt = [[MKTextField alloc] init];
    [txt addTarget:self action:@selector(_textfieldDidChange:) forControlEvents:UIControlEventEditingChanged];
    [txt addTarget:self action:@selector(_textfieldBeginEditing:) forControlEvents:UIControlEventEditingDidBegin];
    [txt addTarget:self action:@selector(_textfieldEndEditing:) forControlEvents:UIControlEventEditingDidEnd];
    [txt addTarget:self action:@selector(_textfieldSubmitEditing:) forControlEvents:UIControlEventEditingDidEndOnExit];
    [txt addTarget:self action:@selector(_textfieldBlur:) forControlEvents:UIControlEventTouchUpOutside];
    return txt;
}

RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(padding, CGSize)
RCT_EXPORT_VIEW_PROPERTY(floatingLabelEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(floatingLabelBottomMargin, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(floatingLabelFont, UIFont)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(bottomBorderWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(highlightColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
//RCT_EXPORT_VIEW_PROPERTY(secureTextEntry, BOOL)
RCT_REMAP_VIEW_PROPERTY(password, secureTextEntry, BOOL)
RCT_EXPORT_VIEW_PROPERTY(editable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCorrect, BOOL)
RCT_REMAP_VIEW_PROPERTY(autoCapitalize, autocapitalizationType, UITextAutocapitalizationType)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
RCT_EXPORT_VIEW_PROPERTY(returnKeyType, UIReturnKeyType)
RCT_REMAP_VIEW_PROPERTY(autoReturnKey, enableReturnKeyAutomatically, BOOL)

// fonts
RCT_REMAP_VIEW_PROPERTY(color, textColor, UIColor)
RCT_CUSTOM_VIEW_PROPERTY(fontSize, CGFloat, MKTextField)
{
    view.font = [RCTConvert UIFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, __unused MKTextField)
{
    view.font = [RCTConvert UIFont:view.font withWeight:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, __unused MKTextField)
{
    view.font = [RCTConvert UIFont:view.font withStyle:json]; // defaults to normal
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, MKTextField)
{
    view.font = [RCTConvert UIFont:view.font withFamily:json ?: defaultView.font.familyName];
}

// -----------------------------
// common MKLayer properties

RCT_REMAP_VIEW_PROPERTY(shadowColor, layer.shadowColor, CGColor)
RCT_REMAP_VIEW_PROPERTY(shadowOffset, layer.shadowOffset, CGSize)
RCT_REMAP_VIEW_PROPERTY(shadowOpacity, layer.shadowOpacity, float)
RCT_REMAP_VIEW_PROPERTY(shadowRadius, layer.shadowRadius, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(cornerRadius, float)
RCT_EXPORT_VIEW_PROPERTY(maskEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rippleEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backgroundLayerCornerRadius, float)
RCT_EXPORT_VIEW_PROPERTY(backgroundAniEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(ripplePercent, float)
RCT_EXPORT_VIEW_PROPERTY(rippleLayerColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(rippleAniTimingFunction, rippleAniTimingFunctionByName, NSString)
RCT_REMAP_VIEW_PROPERTY(rippleLocation, rippleLocationByName, NSString)

#define RCT_TEXT_EVENT_HANDLER(delegateMethod, eventName)              \
- (void)delegateMethod:(MKTextField*)sender                            \
{                                                                      \
  [self.bridge.eventDispatcher sendTextEventWithType:eventName         \
                                            reactTag:sender.reactTag   \
                                                text:sender.text];     \
}

RCT_TEXT_EVENT_HANDLER(_textfieldDidChange, RCTTextEventTypeChange)
RCT_TEXT_EVENT_HANDLER(_textfieldEndEditing, RCTTextEventTypeEnd)
RCT_TEXT_EVENT_HANDLER(_textfieldSubmitEditing, RCTTextEventTypeSubmit)
RCT_TEXT_EVENT_HANDLER(_textfieldBeginEditing, RCTTextEventTypeFocus)
RCT_TEXT_EVENT_HANDLER(_textfieldBlur, RCTTextEventTypeBlur)

// - (void)_textfieldBeginEditing:(MKTextField*)sender
// {
//  if (_selectTextOnFocus) {
//    dispatch_async(dispatch_get_main_queue(), ^{
//      [self selectAll:nil];
//    });
//  }
//  [_eventDispatcher sendTextEventWithType:RCTTextEventTypeFocus
//                                 reactTag:self.reactTag
//                                     text:self.text];
// }

@end
