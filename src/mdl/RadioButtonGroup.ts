import {Prediction} from '../types';
import RadioButton from './RadioButton'

type Pred = Prediction<RadioButton>

//
// ## <section id='Group'>Group</section>
// Managing a group of radio buttons.
export default class RadioButtonGroup {
  private readonly onAdd?: Pred;
  private readonly onRemove?: Pred;
  private buttons: RadioButton[];

  constructor(onAdd?: Pred, onRemove?: Pred) {
    this.buttons = [];
    this.onAdd = onAdd;
    this.onRemove = onRemove;
  }

  add(btn: RadioButton) {
    if (this.canAdd(btn) && this.buttons.indexOf(btn) < 0) {
      this.buttons.push(btn);
    }
  }

  remove(btn: RadioButton) {
    if (this.canRemove(btn)) {
      const index = this.buttons.indexOf(btn);
      if (index >= 0) {
        this.buttons.splice(index, 1);
      }
    }
  }

  onChecked(btn: RadioButton, checked: boolean) {
    if (checked) this.buttons.forEach(it => (it !== btn) && it.confirmUncheck());
  }

  private canAdd(btn: RadioButton): boolean {
    return !this.onAdd || this.onAdd(btn);
  }

  private canRemove(btn: RadioButton): boolean {
    return !this.onRemove || this.onRemove(btn);
  }
}
