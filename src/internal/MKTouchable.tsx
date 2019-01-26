//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//

import React, {
  Component,
  forwardRef,
} from 'react'

import {
  NativeSyntheticEvent,
  requireNativeComponent,
  ViewProps,
} from 'react-native'

import {partial} from 'ramda';

import {convertCoordinate} from '../utils'

export interface TouchEvent {
  type: 'TOUCH_DOWN' | 'TOUCH_UP' | 'TOUCH_MOVE' | 'TOUCH_CANCEL'
  x: number
  y: number
}

type NativeTouchEvent = NativeSyntheticEvent<TouchEvent>

// ## <section id='props'>Props</section>
export type MKTouchableProps = {
  // Touch events callback
  onTouch?: (event: TouchEvent) => void,
} & ViewProps

//
// ## <section id='MKTouchable'>MKTouchable</section>
//
const MKTouchable = forwardRef<Component, MKTouchableProps>((props, ref) =>
  <NativeTouchable
    ref={ref}
    {...props}
    onChange={partial(onTouch, [props])}
  />
);

function onTouch(props: MKTouchableProps, event: NativeTouchEvent) {
  if (props.onTouch) {
    const evt = event.nativeEvent;
    evt.x = convertCoordinate(evt.x);
    evt.y = convertCoordinate(evt.y);
    props.onTouch(evt);
  }
}

// @ts-ignore ComponentInterface requires `propTypes`
const NativeTouchable = requireNativeComponent('MKTouchable', MKTouchable, {
  nativeOnly: {
    nativeBackgroundAndroid: true,
    nativeForegroundAndroid: true,
  },
});

// ## Public interface
export default MKTouchable
