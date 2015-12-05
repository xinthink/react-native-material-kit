package com.github.xinthink.rnmk;

import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewManager;
import com.github.xinthink.rnmk.widget.MKTouchable;

/**
 * MKTouchable View Manager, forwarding touch events to JS module
 *
 * Created by ywu on 15/9/23.
 */
public class MKTouchableManager extends ReactViewManager {

    @Override
    public String getName() {
        return "MKTouchable";
    }

    @Override
    public MKTouchable createViewInstance(ThemedReactContext context) {
        final RCTEventEmitter emitter = context.getJSModule(RCTEventEmitter.class);
        return new MKTouchable(context, new View.OnTouchListener() {
            private int prevAction;
            private long prevEventTime;

            @Override
            public boolean onTouch(View view, MotionEvent event) {
                String type = isInBounds(view, event) ? getEventType(event) : "TOUCH_CANCEL";

                if (type != null && isValid(event)) {
                    WritableMap body = Arguments.createMap();
                    body.putString("type", type);
                    body.putDouble("x", event.getX());
                    body.putDouble("y", event.getY());

                    emitter.receiveEvent(view.getId(), "topChange", body);
                }
                return true;
            }

            private String getEventType(MotionEvent evt) {
                String type = null;
                switch (evt.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        type = "TOUCH_DOWN";
                        break;
                    case MotionEvent.ACTION_UP:
                        type = "TOUCH_UP";
                        break;
                    case MotionEvent.ACTION_CANCEL:
                        type = "TOUCH_CANCEL";
                        break;
                    case MotionEvent.ACTION_MOVE:
                        type = "TOUCH_MOVE";
                        break;
                }
                return type;
            }

            private boolean isInBounds(View v, MotionEvent evt) {
                float x = evt.getX(), y = evt.getY();
                return x >= 0 && x <= v.getWidth() && y >= 0 && y <= v.getHeight();
            }

            private boolean isValid(MotionEvent evt) {
                final long now = System.currentTimeMillis();
                boolean valid;
                if (prevEventTime == 0) {
                    valid = true;
                } else {
                    long elapsed = now - prevEventTime;
                    valid = evt.getAction() != prevAction || elapsed > 80;
                }

                if (valid) {
                    prevAction = evt.getAction();
                    prevEventTime = now;
                }

                return valid;
            }
        });
    }
}
