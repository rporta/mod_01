package com.emulate;

import android.view.KeyEvent;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;


import java.lang.reflect.Field;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ProcessKey {
    public String key;
    protected CordovaWebView appView;
    public static String TAG = "ProcessKey";
    public ProcessKey(){
        this("");
    }

    public ProcessKey(String key){
        this.key = key;
    }

    public void emulateProcessKey(){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();

        LOG.d(TAG, nameofCurrMethod);

        Field[] f = KeyEvent.class.getDeclaredFields();

        String patternPrefix =  ".+KEYCODE_";

        //dafault instance KeyEvent
        KeyEvent instanceKey = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_HELP);

        for(char ch : this.key.toCharArray()){

            //aca recorro currentChar
            String currentField = "";
            String currentChar = String.valueOf(ch);
            Pattern pCase1 = Pattern.compile("\\w", Pattern.CASE_INSENSITIVE);
            Matcher mCase1 = pCase1.matcher(currentChar);
            LOG.d(TAG, " , currentChar : " + currentChar);
            if(mCase1.find()){
//                LOG.d(TAG, "case \\w :  \\s|a-z|A-Z|0-9|_");
                //case \w :  \s|a-z|A-Z|0-9|_
                pCase1 = null;
                mCase1 = null;

                Pattern pSubCase1 = Pattern.compile("[a-z]");
                Matcher mSubCase1 = pSubCase1.matcher(currentChar);
                if(mSubCase1.find()){
                    LOG.d(TAG, "case a-z");
                    //sub-cases 1: [a-z]
                    for (int i = 0; i < f.length; i++) {
                        currentField = f[i].toString();
                        Pattern p = Pattern.compile(patternPrefix + currentChar + "$", Pattern.CASE_INSENSITIVE);
                        Matcher m = p.matcher(currentField);
                        if(m.find()){
                            LOG.d(TAG, " , patternPrefix + currentChar : " + patternPrefix + currentChar);
                            LOG.d(TAG, " , currentField : " + currentField);

                            try {
                                KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, f[i].getInt(instanceKey));
                                this.getAppView().getView().dispatchKeyEvent(key);
                            } catch (IllegalAccessException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }else{
                    pSubCase1 = null;
                    mSubCase1 = null;
                }
                Pattern pSubCase2 = Pattern.compile("[A-Z]");
                Matcher mSubCase2 = pSubCase2.matcher(currentChar);
                if(mSubCase2.find()){
                    //sub-cases 2: [A-Z]
                    LOG.d(TAG, "case A-Z");

                    for (int i = 0; i < f.length; i++) {
                        currentField = f[i].toString();
                        Pattern p = Pattern.compile(patternPrefix + currentChar + "$", Pattern.CASE_INSENSITIVE);
                        Matcher m = p.matcher(currentField);
                        if(m.find()){
                            LOG.d(TAG, " , patternPrefix + currentChar : " + patternPrefix + currentChar);
                            LOG.d(TAG, " , currentField : " + currentField);

                            try {
                                KeyEvent key = new KeyEvent(0L, 0L, KeyEvent.ACTION_DOWN, f[i].getInt(instanceKey), KeyEvent.META_CAPS_LOCK_ON);
                                this.getAppView().getView().dispatchKeyEvent(key);
                            } catch (IllegalAccessException e) {
                                e.printStackTrace();
                            }
                        }
                    }


                }else{
                    pSubCase2 = null;
                    mSubCase2 = null;
                }
                Pattern pSubCase3 = Pattern.compile("\\d");
                Matcher mSubCase3 = pSubCase3.matcher(currentChar);
                if(mSubCase3.find()){
                    //sub-cases 3: [0-9]
                    for (int i = 0; i < f.length; i++) {
                        currentField = f[i].toString();
                        Pattern p = Pattern.compile(patternPrefix + currentChar + "$", Pattern.CASE_INSENSITIVE);
                        Matcher m = p.matcher(currentField);
                        if(m.find()){
                            LOG.d(TAG, " , patternPrefix + currentChar : " + patternPrefix + currentChar);
                            LOG.d(TAG, " , currentField : " + currentField);

                            try {
                                KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, f[i].getInt(instanceKey));
                                this.getAppView().getView().dispatchKeyEvent(key);
                            } catch (IllegalAccessException e) {
                                e.printStackTrace();
                            }
                        }
                    }

                }else{
                    pSubCase3 = null;
                    mSubCase3 = null;
                }
                Pattern pSubCase4 = Pattern.compile("_");
                Matcher mSubCase4 = pSubCase4.matcher(currentChar);
                if(mSubCase4.find()){
                    //sub-cases 4: [_]
                }else{
                    pSubCase4 = null;
                    pSubCase4 = null;
                }
            }else{
                LOG.d(TAG, "Case \\W: -|symbol");
                //Case \W: -|symbol
                pCase1 = null;
                mCase1 = null;

                Pattern pSubCase0 = Pattern.compile("\\s");
                Matcher mSubCase0 = pSubCase0.matcher(currentChar);
                if(mSubCase0.find()){
                    //sub-cases 0: [\s]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_SPACE);
                    this.getAppView().getView().dispatchKeyEvent(key);
                    //resolve
                }else{
                    pSubCase0 = null;
                    mSubCase0 = null;
                }

                Pattern pSubCase1 = Pattern.compile("-");
                Matcher mSubCase1 = pSubCase1.matcher(currentChar);
                if(mSubCase1.find()){
                    //sub-cases 1: [-]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MINUS);
                    this.getAppView().getView().dispatchKeyEvent(key);

                }else{
                    pSubCase1 = null;
                    mSubCase1 = null;
                }
                Pattern pSubCase2 = Pattern.compile("\\.");
                Matcher mSubCase2 = pSubCase2.matcher(currentChar);
                if(mSubCase2.find()){
                    //sub-cases 2: [.]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_PERIOD);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase2 = null;
                    mSubCase2 = null;
                }
                Pattern pSubCase3 = Pattern.compile(",");
                Matcher mSubCase3 = pSubCase3.matcher(currentChar);
                if(mSubCase3.find()){
                    //sub-cases 3: [,]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_COMMA);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase3 = null;
                    mSubCase3 = null;
                }
                Pattern pSubCase4 = Pattern.compile(";");
                Matcher mSubCase4 = pSubCase4.matcher(currentChar);
                if(mSubCase4.find()){
                    //sub-cases 4: [;]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_SEMICOLON);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase4 = null;
                    mSubCase4 = null;
                }
                Pattern pSubCase5 = Pattern.compile(":");
                Matcher mSubCase5 = pSubCase5.matcher(currentChar);
                if(mSubCase5.find()){
                    //sub-cases 5: [:]
                }else{
                    pSubCase5 = null;
                    mSubCase5 = null;

                }
                Pattern pSubCase6 = Pattern.compile("\\{");
                Matcher mSubCase6 = pSubCase6.matcher(currentChar);
                if(mSubCase6.find()){
                    //sub-cases 6: [{]
                }else{
                    pSubCase6 = null;
                    mSubCase6 = null;
                }
                Pattern pSubCase7 = Pattern.compile("\\}");
                Matcher mSubCase7 = pSubCase7.matcher(currentChar);
                if(mSubCase7.find()){
                    //sub-cases 7: [}]
                }else{
                    pSubCase7 = null;
                    mSubCase7 = null;
                }
                Pattern pSubCase8 = Pattern.compile("\\[");
                Matcher mSubCase8 = pSubCase8.matcher(currentChar);
                if(mSubCase8.find()){
                    //sub-cases 8: [[]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_LEFT_BRACKET);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase8 = null;
                    mSubCase8 = null;
                }
                Pattern pSubCase9 = Pattern.compile("]");
                Matcher mSubCase9 = pSubCase9.matcher(currentChar);
                if(mSubCase9.find()){
                    //sub-cases 9: []]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_RIGHT_BRACKET);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase9 = null;
                    mSubCase9 = null;
                }
                Pattern pSubCase10 = Pattern.compile("/");
                Matcher mSubCase10 = pSubCase10.matcher(currentChar);
                if(mSubCase10.find()){
                    //sub-cases 10: [/]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_SLASH);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase10 = null;
                    mSubCase10 = null;
                }
                Pattern pSubCase11 = Pattern.compile("\\*");
                Matcher mSubCase11 = pSubCase11.matcher(currentChar);
                if(mSubCase11.find()){
                    //sub-cases 11: [*]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_NUMPAD_MULTIPLY);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase11 = null;
                    mSubCase11 = null;
                }
                Pattern pSubCase12 = Pattern.compile("-");
                Matcher mSubCase12 = pSubCase12.matcher(currentChar);
                if(mSubCase12.find()){
                    //sub-cases 12: [-]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MINUS);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase12 = null;
                    mSubCase12 = null;
                }
                Pattern pSubCase13 = Pattern.compile("\\+");
                Matcher mSubCase13 = pSubCase13.matcher(currentChar);
                if(mSubCase13.find()){
                    //sub-cases 13: [+]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_PLUS);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase13 = null;
                    mSubCase13 = null;
                }
                Pattern pSubCase14 = Pattern.compile("@");
                Matcher mSubCase14 = pSubCase14.matcher(currentChar);
                if(mSubCase14.find()){
                    //sub-cases 14: [@]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_AT);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase14 = null;
                    mSubCase14 = null;
                }
                Pattern pSubCase15 = Pattern.compile("\"");
                Matcher mSubCase15 = pSubCase15.matcher(currentChar);
                if(mSubCase15.find()){
                    //sub-cases 15: ["]
                }else{
                    pSubCase15 = null;
                    mSubCase15 = null;
                }
                Pattern pSubCase16 = Pattern.compile("'");
                Matcher mSubCase16 = pSubCase16.matcher(currentChar);
                if(mSubCase16.find()){
                    //sub-cases 16: [']
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_APOSTROPHE);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase16 = null;
                    mSubCase16 = null;
                }
                Pattern pSubCase17 = Pattern.compile("\\|");
                Matcher mSubCase17 = pSubCase17.matcher(currentChar);
                if(mSubCase17.find()){
                    //sub-cases 17: [']
                }else{
                    pSubCase17 = null;
                    mSubCase17 = null;
                }
                Pattern pSubCase18 = Pattern.compile("°");
                Matcher mSubCase18 = pSubCase18.matcher(currentChar);
                if(mSubCase18.find()){
                    //sub-cases 18: [°]
                }else{
                    pSubCase18 = null;
                    mSubCase18 = null;
                }
                Pattern pSubCase19 = Pattern.compile("#");
                Matcher mSubCase19 = pSubCase19.matcher(currentChar);
                if(mSubCase19.find()){
                    //sub-cases 19: [#]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_POUND);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase19 = null;
                    mSubCase19 = null;
                }
                Pattern pSubCase20 = Pattern.compile("·");
                Matcher mSubCase20 = pSubCase20.matcher(currentChar);
                if(mSubCase20.find()){
                    //sub-cases 20: [·]
                }else{
                    pSubCase20 = null;
                    mSubCase20 = null;
                }
                Pattern pSubCase21 = Pattern.compile("\\$");
                Matcher mSubCase21 = pSubCase21.matcher(currentChar);
                if(mSubCase21.find()){
                    //sub-cases 21: [$]
                }else{
                    pSubCase21 = null;
                    mSubCase21 = null;
                }
                Pattern pSubCase22 = Pattern.compile("%");
                Matcher mSubCase22 = pSubCase22.matcher(currentChar);
                if(mSubCase22.find()){
                    //sub-cases 22: [%]
                }else{
                    pSubCase22 = null;
                    mSubCase22 = null;
                }
                Pattern pSubCase23 = Pattern.compile("&");
                Matcher mSubCase23 = pSubCase23.matcher(currentChar);
                if(mSubCase23.find()){
                    //sub-cases 23: [&]
                }else{
                    pSubCase23 = null;
                    mSubCase23 = null;
                }
                Pattern pSubCase24 = Pattern.compile("=");
                Matcher mSubCase24 = pSubCase24.matcher(currentChar);
                if(mSubCase24.find()){
                    //sub-cases 24: [=]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_NUMPAD_EQUALS);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase24 = null;
                    mSubCase24 = null;
                }
                Pattern pSubCase25 = Pattern.compile("\\?");
                Matcher mSubCase25 = pSubCase25.matcher(currentChar);
                if(mSubCase25.find()){
                    //sub-cases 25: [?]
                }else{
                    pSubCase25 = null;
                    mSubCase25 = null;
                }
                Pattern pSubCase26 = Pattern.compile("¿");
                Matcher mSubCase26 = pSubCase26.matcher(currentChar);
                if(mSubCase26.find()){
                    //sub-cases 26: [¿]
                }else{
                    pSubCase26 = null;
                    mSubCase26 = null;
                }
                Pattern pSubCase27 = Pattern.compile("¡");
                Matcher mSubCase27 = pSubCase27.matcher(currentChar);
                if(mSubCase27.find()){
                    //sub-cases 27: [¡]
                }else{
                    pSubCase27 = null;
                    mSubCase27 = null;
                }
                Pattern pSubCase28 = Pattern.compile("!");
                Matcher mSubCase28 = pSubCase28.matcher(currentChar);
                if(mSubCase28.find()){
                    //sub-cases 28: [!]
                }else{
                    pSubCase28 = null;
                    mSubCase28 = null;
                }
                Pattern pSubCase29 = Pattern.compile("<");
                Matcher mSubCase29 = pSubCase29.matcher(currentChar);
                if(mSubCase29.find()){
                    //sub-cases 29: [<]
                }else{
                    pSubCase29 = null;
                    mSubCase29 = null;
                }
                Pattern pSubCase30 = Pattern.compile(">");
                Matcher mSubCase30 = pSubCase30.matcher(currentChar);
                if(mSubCase30.find()){
                    //sub-cases 30: [>]
                }else{
                    pSubCase30 = null;
                    mSubCase30 = null;
                }
                Pattern pSubCase31 = Pattern.compile("\\\\");
                Matcher mSubCase31 = pSubCase31.matcher(currentChar);
                if(mSubCase31.find()){
                    //sub-cases 31: [\]
                    KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_BACKSLASH);
                    this.getAppView().getView().dispatchKeyEvent(key);
                }else{
                    pSubCase31 = null;
                    mSubCase31 = null;
                }
            }
        }
    }

    public CordovaWebView getAppView(){
        return this.appView;
    }
    public void setAppView(CordovaWebView appView){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        LOG.d(TAG, nameofCurrMethod);
        this.appView = appView;
    }
    public String getKey(){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        LOG.d(TAG, nameofCurrMethod);
        return this.key;
    }
    public void setKey(String key){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        LOG.d(TAG, nameofCurrMethod);
        this.key = key;
    }

}
