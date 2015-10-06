package com.github.xinthink.rnmk.utils;

import android.content.Context;
import android.os.Build;

/**
 * Utilities.
 *
 * Created by ywu on 15/10/6.
 */
public final class Utils {

    private Utils() {

    }

    @SuppressWarnings("deprecation")
    public static int getColor(Context context, int resId) {
        int color;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            color = context.getResources().getColor(resId, context.getTheme());
        } else {
            color = context.getResources().getColor(resId);
        }

        return color;
    }

    public static int toPixels(Context context, float dps) {
        float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dps * scale + 0.5f);
    }
}
