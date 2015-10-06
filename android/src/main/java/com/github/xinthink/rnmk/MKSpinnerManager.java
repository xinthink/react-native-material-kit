package com.github.xinthink.rnmk;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.CSSColorUtil;
import com.facebook.react.uimanager.CatalystStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIProp;
import com.github.xinthink.rnmk.utils.Utils;
import com.github.xinthink.rnmk.widget.MKSpinner;

/**
 * MKSpinner View Manager, forwarding touch events to JS module
 *
 * Created by ywu on 15/9/23.
 */
public class MKSpinnerManager extends SimpleViewManager<MKSpinner> {

    /**
     * Color scheme of the progress stroke
     */
    @UIProp(UIProp.Type.ARRAY)
    public static final String PROP_STROKE_COLORS = "strokeColors";

    /**
     * Width of the progress stroke
     */
    @UIProp(UIProp.Type.NUMBER)
    public static final String PROP_STROKE_WIDTH = "strokeWidth";

    /**
     * Duration of the spinner animation, in milliseconds
     */
    @UIProp(UIProp.Type.NUMBER)
    public static final String PROP_ANI_DURATION = "spinnerAniDuration";

    @Override
    public String getName() {
        return "MKSpinner";
    }

    @Override
    public MKSpinner createViewInstance(ThemedReactContext context) {
        return new MKSpinner(context);
    }

    @Override
    public void updateView(MKSpinner spinner, CatalystStylesDiffMap props) {
        super.updateView(spinner, props);

        if (props.hasKey(PROP_STROKE_COLORS)) {
            ReadableArray colors = props.getArray(PROP_STROKE_COLORS);

            if (colors != null && colors.size() > 0) {
                int[] colorScheme = new int[colors.size()];

                for (int i = 0; i < colors.size(); i++) {
                    if (!colors.isNull(i)) {
                        colorScheme[i] = CSSColorUtil.getColor(colors.getString(i));
                    }
                }

                spinner.setStrokeColors(colorScheme);
            }
        }

        if (props.hasKey(PROP_STROKE_WIDTH)) {
            spinner.setStrokeWidth(Utils.toPixels(spinner.getContext(),
                    props.getFloat(PROP_STROKE_WIDTH, 0)));
        }

        if (props.hasKey(PROP_ANI_DURATION)) {
            spinner.setSpinnerAniDuration(props.getInt(PROP_ANI_DURATION, 0));
        }
    }
}
