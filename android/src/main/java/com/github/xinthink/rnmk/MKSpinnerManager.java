package com.github.xinthink.rnmk;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.xinthink.rnmk.widget.MKSpinner;

import javax.annotation.Nullable;

/**
 * MKSpinner View Manager
 *
 * Created by ywu on 15/9/23.
 */
public class MKSpinnerManager extends SimpleViewManager<MKSpinner> {

    @Override
    public String getName() {
        return "MKSpinner";
    }

    @Override
    public MKSpinner createViewInstance(ThemedReactContext context) {
        return new MKSpinner(context);
    }

    /**
     * Color scheme of the progress stroke
     */
    @ReactProp(name = "strokeColors")
    public void setStrokeColors(MKSpinner view, @Nullable ReadableArray colors) {
        if (colors != null && colors.size() > 0) {
            int[] colorScheme = new int[colors.size()];

            for (int i = 0; i < colors.size(); i++) {
                if (!colors.isNull(i)) {
                    colorScheme[i] = colors.getInt(i);
                }
            }

            view.setStrokeColors(colorScheme);
        }
    }

    /**
     * Width of the progress stroke
     */
    @ReactProp(name = "strokeWidth", defaultFloat = 0)
    public void setStrokeWidth(MKSpinner view, float strokeWidthDp) {
        view.setStrokeWidthInDip(strokeWidthDp);
    }

    /**
     * Duration of the spinner animation, in milliseconds
     */
    @ReactProp(name = "spinnerAniDuration", defaultInt = 0)
    public void setSpinnerAniDuration(MKSpinner view, int duration) {
        view.setSpinnerAniDuration(duration);
    }

}
