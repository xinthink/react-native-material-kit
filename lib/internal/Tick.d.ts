/**
 * The `Tick` part used in `Checkbox`, for internal use only
 */
import { Component } from 'react';
import { ViewProps } from 'react-native';
export interface TickProps extends ViewProps {
    /** Background color of the tick */
    fillColor?: string;
    /** Insets of the tick */
    inset?: number;
}
/**
 * Wrap the native `Tick` component, which is used in {@link Checkbox}.
 *
 * Note: `createAnimatedComponent` does not support SFC
 */
export default class Tick extends Component<TickProps> {
    render: () => JSX.Element;
}
export declare const AnimatedTick: any;
//# sourceMappingURL=Tick.d.ts.map