/**
 *  Touchable view, for listening to touch events, but not intercept them.
 *
 *  Created by ywu on 15/9/22.
 */
import React from 'react';
import { ViewProps } from 'react-native';
/** Touching event emitted by a {@link MKTouchable} */
export interface TouchEvent {
    type: 'TOUCH_DOWN' | 'TOUCH_UP' | 'TOUCH_MOVE' | 'TOUCH_CANCEL';
    x: number;
    y: number;
}
/** Props of {@link MKTouchable} */
export interface MKTouchableProps extends ViewProps {
    /** Touch events callback */
    onTouch?: (event: TouchEvent) => void;
}
/**
 * Wrap the native component `MKTouchable`.
 */
declare const MKTouchable: React.ComponentType<MKTouchableProps & React.ClassAttributes<React.Component<{}, {}, any>>>;
export default MKTouchable;
//# sourceMappingURL=MKTouchable.d.ts.map