package com.github.xinthink.rnmk.widget;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.support.annotation.NonNull;
import android.util.AttributeSet;
import android.view.View;

import com.facebook.react.uimanager.ReactCompoundView;
import com.github.xinthink.rnmk.R;
import com.github.xinthink.rnmk.utils.Utils;

/**
 * The 'tick' used in `Checkbox`, for internal use only
 * <p/>
 * Created by ywu on 15/12/6.
 */
public class TickView extends View implements ReactCompoundView {

    private int fillColor;
    private int inset;

    private Paint bgPaint;
    private Path tickPath, tickBoundsPath;
    private RectF rect;

    public TickView(Context context) {
        this(context, null, 0);
    }

    public TickView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TickView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initDefaults();
        init(context, attrs);
        initPaints();
    }

    private void initDefaults() {
        Resources res = getResources();
        fillColor = res.getColor(R.color.mdl_indigo);
        inset = res.getDimensionPixelOffset(R.dimen.mk_tick_inset);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs == null) {
            return;
        }

        TypedArray a = context.getTheme().obtainStyledAttributes(
                attrs,
                R.styleable.TickView,
                0, 0);

        try {
            fillColor = a.getColor(R.styleable.TickView_mk_tickFillColor, fillColor);
            inset = a.getDimensionPixelOffset(R.styleable.TickView_mk_tickInset, inset);
        } finally {
            a.recycle();
        }
    }

    @Override
    public int reactTagForTouch(float touchX, float touchY) {
        return getId();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int w = MeasureSpec.getSize(widthMeasureSpec);
        int h = MeasureSpec.getSize(heightMeasureSpec);
        w = h = Math.min(w, h);  // make it a square
        setMeasuredDimension(w, h);

        calcBounds(w, h);  // update bounds
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        calcBounds(w, h);
    }

    private void calcBounds(int w, int h) {
        if (rect == null || rect.right != w || rect.bottom != h) {
            rect = new RectF(0, 0, w, h);
            calcTickPath(rect);
        }
    }

    private void calcTickPath(@NonNull RectF bounds) {
        final float left = bounds.left;
        final float right = bounds.right;
        final float top = bounds.top;
        final float bottom = bounds.bottom;

        float extraBottomInset = 2;  // #117 Leaving 2px gap from bottom
        float width = right - left;
        float baseSize = width / 3f;  // choose a box at the left bottom corner which defines the width of the tick
        float tickBottomY = bottom - this.inset - extraBottomInset;
        float tickWidth = (float) ((baseSize - this.inset - extraBottomInset) / Math.sqrt(2));
        float a = (float) (tickWidth / Math.sqrt(2));
        float x0 = left + inset;
        float y0 = tickBottomY - (baseSize - inset);

        tickPath = new Path();
        tickPath.setFillType(Path.FillType.INVERSE_EVEN_ODD);
        tickPath.moveTo(x0, y0);
        tickPath.lineTo(x0 + a, y0 - a);
        tickPath.lineTo(baseSize, bottom - baseSize);
        tickPath.lineTo(right - a - inset, top + a + inset);
        tickPath.lineTo(right - inset, top + 2 * a + inset);
        tickPath.lineTo(baseSize, tickBottomY);
        tickPath.close();

        // the remain parts outside the tick
        tickBoundsPath = new Path();
        tickBoundsPath.addRect(0, 0, inset, bottom, Path.Direction.CW);
        tickBoundsPath.addRect(right - inset, 0, right, bottom, Path.Direction.CW);
        tickBoundsPath.addRect(inset, 0, right - inset, top + a + inset, Path.Direction.CW);
        tickBoundsPath.addRect(inset, tickBottomY, right - inset, bottom, Path.Direction.CW);
    }

    private void initPaints() {
        if (bgPaint == null) {
            bgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
            bgPaint.setColor(fillColor);
            bgPaint.setStyle(Paint.Style.FILL);
        }
    }

    public void setFillColor(int fillColor) {
        this.fillColor = fillColor;
        this.bgPaint = null;
        initPaints();
        invalidate();
    }

    public void setInset(int inset) {
        this.inset = inset;
        if (rect != null) {
            calcTickPath(rect);
            invalidate();
        }
    }

    public void setInsetInDip(float insetDp) {
        setInset(Utils.toPixels(getContext(), insetDp));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawPath(tickPath, bgPaint);
        canvas.drawPath(tickBoundsPath, bgPaint);
    }
}
