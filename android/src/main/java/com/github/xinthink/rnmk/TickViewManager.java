package com.github.xinthink.rnmk;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.github.xinthink.rnmk.widget.TickView;

/**
 * TickView view manger, for internal use only
 * Created by ywu on 15/12/13.
 */
public class TickViewManager extends SimpleViewManager<TickView> {
    @Override
    public String getName() {
        return "TickView";
    }

    @Override
    protected TickView createViewInstance(ThemedReactContext context) {
        return new TickView(context);
    }

    /**
     * Background color of the tick
     */
    @ReactProp(name = "fillColor")
    public void setFillColor(TickView view, int color) {
        view.setFillColor(color);
    }

    /**
     * Insets of the tick
     */
    @ReactProp(name = "inset")
    public void setInset(TickView view, float dim) {
        view.setInsetInDip(dim);
    }
}
