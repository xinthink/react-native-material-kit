/**
 * Managing a group of radio buttons.
 */
export default class RadioButtonGroup {
    constructor(onAdd, onRemove) {
        this.buttons = [];
        this.onAdd = onAdd;
        this.onRemove = onRemove;
    }
    add(btn) {
        if (this.canAdd(btn) && this.buttons.indexOf(btn) < 0) {
            this.buttons.push(btn);
        }
    }
    remove(btn) {
        if (this.canRemove(btn)) {
            const index = this.buttons.indexOf(btn);
            if (index >= 0) {
                this.buttons.splice(index, 1);
            }
        }
    }
    onChecked(btn, checked) {
        if (checked) {
            this.buttons.forEach(it => it !== btn && it.confirmUncheck());
        }
    }
    canAdd(btn) {
        return !this.onAdd || this.onAdd(btn);
    }
    canRemove(btn) {
        return !this.onRemove || this.onRemove(btn);
    }
}
//# sourceMappingURL=RadioButtonGroup.js.map