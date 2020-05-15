/* tslint:disable:max-classes-per-file */
/**
 * Theme definition.
 *
 * Created by ywu on 15/7/18.
 */
import MKColor from './MKColor';
const theme = {};
class AttrReference {
    constructor(attr) {
        this.attr = attr;
    }
    get value() {
        return theme[this.attr];
    }
}
class RGBAttrReference extends AttrReference {
    constructor(attr, alpha) {
        super(attr);
        this.alpha = alpha;
    }
    get value() {
        // @ts-ignore: https://github.com/Microsoft/TypeScript/issues/4465
        const v = super.value;
        return this.alpha > 0 ? `rgba(${v}, ${this.alpha})` : `rgb(${v})`;
    }
}
const primaryColorRef = new AttrReference('primaryColor');
const accentColorRef = new AttrReference('accentColor');
//
// ## <section id='theme'>theme</section>
//
Object.assign(theme, {
    primaryColor: MKColor.Indigo,
    primaryColorRGB: MKColor.RGBIndigo,
    accentColor: MKColor.Pink,
    accentColorRGB: MKColor.RGBPink,
    bgDisabled: 'rgba(0, 0, 0, 0.12)',
    bgPlain: 'rgba(158, 158, 158, 0.2)',
    fontColor: 'rgb(117, 117, 117)',
    fontSize: 14,
    rippleColor: 'rgba(255, 255, 255, 0.125)',
    textfieldStyle: {
        highlightColor: new RGBAttrReference('primaryColorRGB', 0.9),
        textInputStyle: {
            color: new AttrReference('fontColor'),
            fontSize: 16,
            paddingLeft: 0,
            paddingRight: 0,
        },
        tintColor: 'rgba(0, 0, 0, 0.12)',
    },
    progressStyle: {
        backgroundColor: new RGBAttrReference('primaryColorRGB', 0.3),
        bufferColor: new RGBAttrReference('primaryColorRGB', 0.3),
        progressColor: primaryColorRef,
    },
    spinnerStyle: {
        strokeColor: [
            MKColor.palette_blue_400,
            MKColor.palette_red_500,
            MKColor.palette_yellow_600,
            MKColor.palette_green_500,
        ],
    },
    sliderStyle: {
        lowerTrackColor: primaryColorRef,
        upperTrackColor: '#cccccc',
    },
    iconToggleStyle: {
        offColor: 'rgba(0, 0, 0, 0.25)',
        onColor: new RGBAttrReference('primaryColorRGB', 0.4),
        rippleColor: new AttrReference('bgPlain'),
    },
    switchStyle: {
        offColor: 'rgba(0, 0, 0, 0.25)',
        onColor: new RGBAttrReference('primaryColorRGB', 0.4),
        rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
        thumbOffColor: MKColor.Silver,
        thumbOnColor: primaryColorRef,
    },
    radioStyle: {
        borderOffColor: primaryColorRef,
        borderOnColor: primaryColorRef,
        fillColor: primaryColorRef,
        rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
    },
    checkboxStyle: {
        borderOffColor: 'rgba(0, 0, 0, 0.56)',
        borderOnColor: primaryColorRef,
        fillColor: primaryColorRef,
        inset: 0,
        rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
    },
    cardStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderRadius: 2,
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOffset: {
            height: 1,
            width: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    cardImageStyle: {
        height: 170,
        resizeMode: 'cover',
    },
    cardTitleStyle: {
        position: 'absolute',
        left: 26,
        top: 120,
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
    },
    cardContentStyle: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 15,
    },
    cardActionStyle: {
        borderStyle: 'solid',
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderTopWidth: 1,
        padding: 15,
    },
    cardMenuStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 16,
        top: 16,
    },
});
function isPlainObject(o) {
    return (typeof o === 'object' &&
        !Array.isArray(o) &&
        o !== null &&
        !(o instanceof String) &&
        !(o instanceof Function));
}
/** Wrap style object with custom getter, for resolving the attribute references. */
function wrapAttrRef(style, attr, attrValue) {
    Object.defineProperty(style, attr, {
        enumerable: true,
        get() {
            return attrValue.value;
        },
    });
}
/** Wrap all style attributes with custom getter, recursively */
function wrapStyle(style) {
    Object.getOwnPropertyNames(style).forEach(attr => {
        const v = style[attr];
        if (v instanceof AttrReference) {
            wrapAttrRef(style, attr, v);
        }
        else if (isPlainObject(v)) {
            wrapStyle(v);
        }
    });
    return style;
}
// Wrap the theme object, in order to resolving the attribute references.
wrapStyle(theme);
/**
 * Set the current theme.
 * @param `aTheme` the new {@link Theme}
 *
 * See http://www.getmdl.io/customize
 */
export function setTheme(aTheme) {
    Object.assign(theme, wrapStyle(aTheme));
}
/** Retrieve a copy of the current theme */
export function getTheme() {
    return Object.assign({}, theme);
}
export default {
    AttrReference,
    RGBAttrReference,
    accentColorRef,
    primaryColorRef,
};
//# sourceMappingURL=theme.js.map