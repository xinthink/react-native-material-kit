package com.github.xinthink.rnmk;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

/**
 * Sub-classing ReactTextInputManager to work-around the TextInput underline issue.
 *
 * Created by ywu on 2016/10/2.
 */

public class MKEditTextManager extends ReactTextInputManager {

    @Override
    public String getName() {
        return "MKEditText";
    }

    @Override
    public ReactEditText createViewInstance(ThemedReactContext context) {
        ReactEditText editText = super.createViewInstance(context);
        // remove the system default background drawable
        editText.setBackground(null);
        return editText;
    }
}
