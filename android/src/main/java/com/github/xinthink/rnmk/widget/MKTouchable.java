package com.github.xinthink.rnmk.widget;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;
import android.view.MotionEvent;

import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nonnull;

/**
 * Touchable view, for listening to touch events, but not intercept them.
 *
 * Created by ywu on 15/9/26.
 */
@SuppressLint("ViewConstructor")
public class MKTouchable extends ReactViewGroup {
    @Nonnull
    private final OnTouchListener onTouchListener;

    public MKTouchable(Context context,
                       @Nonnull OnTouchListener onTouchListener) {
        super(context);
        this.onTouchListener = onTouchListener;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        return this.onTouchListener.onTouch(this, ev);
    }
}
