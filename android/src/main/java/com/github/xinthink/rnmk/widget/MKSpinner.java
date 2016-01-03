package com.github.xinthink.rnmk.widget;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Property;
import android.view.View;

import com.facebook.react.uimanager.ReactCompoundView;
import com.github.xinthink.rnmk.R;
import com.github.xinthink.rnmk.utils.Utils;

import static android.animation.ValueAnimator.RESTART;

/**
 * A <a href="http://www.getmdl.io/components/index.html#loading-section/spinner">MDL Spinner</a> component.
 *
 * @author ywu
 *
 * Created by ywu on 15/10/5.
 */
public class MKSpinner extends View implements ReactCompoundView {

    public static final int DEFAULT_STROKE_COLOR = Color.BLUE;

    // --------------------------------
    // Properties
    //
    /**
     * Color scheme of the progress stroke
     */
    private int[] strokeColors;

    /**
     * Width of the progress stroke
     */
    private float strokeWidth;

    /**
     * Duration of the spinner animation, in milliseconds
     */
    private long spinnerAniDuration;

    private int defaultWidth, defaultHeight;

    // --------------------------------
    // Animation properties
    //
    private float containerAngle;
    private float arcStartAngle;
    private float arcSweepAngle = 360;

    private AnimatorSet spinnerAni;

    // ---------------------------
    // Graphics
    //
    private int nextStrokeColorIndex;
    private Paint arcPaint;
    private RectF rect;

    private final Property<MKSpinner, Float> propContainerAngle
            = new Property<MKSpinner, Float>(Float.class, "containerAngle") {
        @Override
        public Float get(MKSpinner spinner) {
            return spinner.containerAngle;
        }

        @Override
        public void set(MKSpinner spinner, Float value) {
            spinner.containerAngle = value;
            spinner.invalidate();
        }
    };

    private final Property<MKSpinner, Float> propArcSweepAngle
            = new Property<MKSpinner, Float>(Float.class, "arcSweepAngle") {
        @Override
        public Float get(MKSpinner spinner) {
            return spinner.arcSweepAngle;
        }

        @Override
        public void set(MKSpinner spinner, Float value) {
            spinner.arcSweepAngle = value;
            float halfAngle = value / 2f;
            spinner.arcStartAngle = 270f - halfAngle;
            spinner.invalidate();
        }
    };

    public MKSpinner(Context context) {
        super(context);
        init(context, null);
    }

    public MKSpinner(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs);
    }

    private void init(Context context, AttributeSet attrs) {
        Resources resources = context.getResources();
        defaultWidth = resources.getDimensionPixelSize(R.dimen.mk_spinner_width);
        defaultHeight = resources.getDimensionPixelSize(R.dimen.mk_spinner_height);

        if (attrs != null) {
            initWithAttrs(context, attrs);
            return;
        }

        // load defaults
        strokeWidth = resources.getDimensionPixelSize(R.dimen.mk_spinner_stroke_width);
        if (isInEditMode()) {
            strokeColors = new int[DEFAULT_STROKE_COLOR];
        } else {
            strokeColors = resources.getIntArray(R.array.mk_spinner_stroke_colors);
        }
        spinnerAniDuration = resources.getInteger(R.integer.mk_spinner_ani_duration);
    }

    private void initWithAttrs(Context context, AttributeSet attrs) {
        TypedArray a = context.getTheme().obtainStyledAttributes(
                attrs,
                R.styleable.MKSpinner,
                0, 0);

        try {
            Resources resources = context.getResources();
            strokeWidth = a.getDimensionPixelSize(R.styleable.MKSpinner_mk_spinnerStrokeWidth,
                    resources.getDimensionPixelSize(R.dimen.mk_spinner_stroke_width));
            strokeColors = resources.getIntArray(a.getResourceId(R.styleable.MKSpinner_mk_spinnerStrokeColors,
                    R.array.mk_spinner_stroke_colors));
            spinnerAniDuration = a.getInteger(R.styleable.MKSpinner_mk_spinnerAniDuration,
                    resources.getInteger(R.integer.mk_spinner_ani_duration));

        } finally {
            a.recycle();
        }
    }

    private void initPaints() {
        if (arcPaint == null) {
            arcPaint = new Paint();
            setupArcPaint();
        }
    }

    private void setupArcPaint() {
        arcPaint.setFlags(Paint.ANTI_ALIAS_FLAG);
        arcPaint.setColor(getNextStrokeColor());
        arcPaint.setStyle(Paint.Style.STROKE);
        arcPaint.setStrokeWidth(strokeWidth);
    }

    private void updateArcColor() {
        if (arcPaint != null) {
            arcPaint.reset();
            setupArcPaint();
        } else {
            initPaints();
        }
    }

    public int[] getStrokeColors() {
        return strokeColors;
    }

    public void setStrokeColors(int... colors) {
        if (colors != null && colors.length > 0) {
            this.strokeColors = colors;
            invalidate();
        }
    }

    private int getNextStrokeColor() {
        if (strokeColors == null || strokeColors.length == 0) {
            return DEFAULT_STROKE_COLOR;
        }

        int index = this.nextStrokeColorIndex % strokeColors.length;
        this.nextStrokeColorIndex = index + 1;
        return strokeColors[index];
    }

    public float getStrokeWidth() {
        return strokeWidth;
    }

    public void setStrokeWidth(float strokeWidth) {
        if (strokeWidth > 0 && strokeWidth != this.strokeWidth) {
            this.strokeWidth = strokeWidth;
            invalidate();
        }
    }

    public void setStrokeWidthInDip(float strokeWidthDp) {
        setStrokeWidth(Utils.toPixels(getContext(), strokeWidthDp));
    }

    public long getSpinnerAniDuration() {
        return spinnerAniDuration;
    }

    public void setSpinnerAniDuration(long duration) {
        if (duration > 0 && duration != this.spinnerAniDuration) {
            this.spinnerAniDuration = duration;
            stop();
            start();
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

        if (w == 0) {
            w = defaultWidth;
        }

        if (h == 0) {
            h = defaultHeight;
        }

        w = h = Math.min(w, h);  // make it square
        setMeasuredDimension(w, h);

        calcBounds(w, h);  // update bounds
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        calcBounds(w, h);
    }

    private void calcBounds(int w, int h) {
        float offset = strokeWidth / 2f;
        float size = Math.min(w, h);
        float right = size - offset;
        float bottom = size - offset;

        if (rect == null || rect.right != right || rect.bottom != bottom) {
            rect = new RectF(offset, offset, right, bottom);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        start();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        stop();
    }

    private void start() {
        if (spinnerAni != null && spinnerAni.isStarted()) {
            return;
        }

        spinnerAni = new AnimatorSet();
        spinnerAni.playTogether(
                initAni(propContainerAngle, null, 0, 360),
                initAni(propArcSweepAngle, new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationRepeat(Animator animator) {
                        updateArcColor();
                    }
                }, 10, 300, 10)
        );
        spinnerAni.setDuration(spinnerAniDuration);
        spinnerAni.start();
    }

    private ObjectAnimator initAni(Property<MKSpinner, Float> p,
                                   Animator.AnimatorListener listener,
                                   float... values) {
        ObjectAnimator ani = ObjectAnimator.ofFloat(this, p, values);
        ani.setRepeatCount(ObjectAnimator.INFINITE);
        ani.setRepeatMode(RESTART);

        if (listener != null) {
            ani.addListener(listener);
        }

        return ani;
    }

    private void stop() {
        if (spinnerAni != null && spinnerAni.isStarted()) {
            spinnerAni.cancel();
            spinnerAni = null;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        initPaints();

        canvas.rotate(containerAngle, getWidth() / 2f, getHeight() / 2f);  // rotate the whole spinner
        canvas.drawArc(rect, arcStartAngle, arcSweepAngle, false, arcPaint);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {  // fix #69
            canvas.restore();
        }
    }
}
