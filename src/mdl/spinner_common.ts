import { ViewProps } from 'react-native';
import { Dimension } from '../types';

/** Props of {@link Spinner}, which extends {@link ViewProps} */
export interface SpinnerProps extends ViewProps {
  /**
   * Colors of the progress stroke.
   *
   * type: {`Array`|`String`} can be a list of colors or a single one
   */
  strokeColor?: any;

  /** Width of the progress stroke */
  strokeWidth?: number;

  /** Duration of the spinner animation, in milliseconds */
  spinnerAniDuration?: number;
}

/** Sate of {@link Spinner} */
export interface SpinnerState {
  dimen: Dimension;
  strokeColor: any;
}

/** Default props of {@link Spinner} */
export const defaultProps: SpinnerProps = {
  spinnerAniDuration: 1333,
  strokeWidth: 3,
  style: {
    height: 28,
    width: 28,
  },
};
