export declare type AttrValue = string | number | Theme | AttrReference;
export declare type NullableAttrValue = AttrValue | null | undefined;
export interface Theme {
    [name: string]: AttrValue;
}
export declare type Style = object | any[];
export declare type NullableStyle = object | any[] | null | undefined;
declare class AttrReference {
    attr: string;
    constructor(attr: string);
    readonly value: AttrValue;
}
declare class RGBAttrReference extends AttrReference {
    alpha: number;
    constructor(attr: string, alpha: number);
    readonly value: AttrValue;
}
/**
 * Set the current theme.
 * @param `aTheme` the new {@link Theme}
 *
 * See http://www.getmdl.io/customize
 */
export declare function setTheme(aTheme: Theme): void;
/** Retrieve a copy of the current theme */
export declare function getTheme(): Theme;
declare const _default: {
    AttrReference: typeof AttrReference;
    RGBAttrReference: typeof RGBAttrReference;
    accentColorRef: AttrReference;
    primaryColorRef: AttrReference;
};
export default _default;
//# sourceMappingURL=theme.d.ts.map