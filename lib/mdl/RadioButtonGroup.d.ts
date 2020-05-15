import { Prediction } from '../types';
import RadioButton from './RadioButton';
declare type Pred = Prediction<RadioButton>;
/**
 * Managing a group of radio buttons.
 */
export default class RadioButtonGroup {
    private readonly onAdd?;
    private readonly onRemove?;
    private buttons;
    constructor(onAdd?: Pred, onRemove?: Pred);
    add(btn: RadioButton): void;
    remove(btn: RadioButton): void;
    onChecked(btn: RadioButton, checked: boolean): void;
    private canAdd;
    private canRemove;
}
export {};
//# sourceMappingURL=RadioButtonGroup.d.ts.map