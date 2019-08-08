import { ReactChild } from 'react';

export type NullableString = string | null | undefined;
export type NullableReactChild = ReactChild | null | undefined;

export interface CheckedEvent {
  checked: boolean;
}

export type CheckedListener = (event: CheckedEvent) => void;

export type Prediction<T> = (obj?: T) => boolean;

export interface Dimension {
  width: number;
  height: number;
}
