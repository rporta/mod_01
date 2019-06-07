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

        for(char currentCh : this.key.toCharArray()){

            for (int i = 0; i < f.length; i++) {
                String currentField = f[i].toString();

                Pattern pCase1 = Pattern.compile("\\w", Pattern.CASE_INSENSITIVE);
                Matcher mCase1 = pCase1.matcher(currentField);
                if(mCase1.find()){
                    //case \w :  a-z|A-Z|0-9|_

                    pCase1 = null;
                    mCase1 = null;
                    Pattern pSubCase1 = Pattern.compile("[a-z]");
                    Matcher mSubCase1 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 1: [a-z]




                    }else{
                        pSubCase1 = null;
                        mSubCase1 = null;
                    }
                    Pattern pSubCase2 = Pattern.compile("[A-Z]");
                    Matcher mSubCase2 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 2: [A-Z]




                    }else{
                        pSubCase2 = null;
                        mSubCase2 = null;
                    }
                    Pattern pSubCase3 = Pattern.compile("\\d");
                    Matcher mSubCase3 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 3: [0-9]




                    }else{
                        pSubCase3 = null;
                        mSubCase3 = null;
                    }
                    Pattern pSubCase4 = Pattern.compile("_");
                    Matcher mSubCase4 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 4: [_]




                    }else{
                        pSubCase4 = null;
                        pSubCase4 = null;
                    }
                }
                else{
                    //Case \W: -|symbol

                    pCase1 = null;
                    mCase1 = null;

                    Pattern pSubCase1 = Pattern.compile("-");
                    Matcher mSubCase1 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 1: [-]




                    }else{
                        pSubCase1 = null;
                        mSubCase1 = null;
                    }
                    Pattern pSubCase2 = Pattern.compile("\\.");
                    Matcher mSubCase2 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 2: [.]




                    }else{
                        pSubCase2 = null;
                        mSubCase2 = null;
                    }
                    Pattern pSubCase3 = Pattern.compile(",");
                    Matcher mSubCase3 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 3: [,]




                    }else{
                        pSubCase3 = null;
                        mSubCase3 = null;
                    }
                    Pattern pSubCase4 = Pattern.compile(";");
                    Matcher mSubCase4 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 4: [;]




                    }else{
                        pSubCase4 = null;
                        mSubCase4 = null;
                    }
                    Pattern pSubCase5 = Pattern.compile(":");
                    Matcher mSubCase5 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 5: [:]




                    }else{
                        pSubCase5 = null;
                        mSubCase5 = null;
                    }
                    Pattern pSubCase6 = Pattern.compile("\\{");
                    Matcher mSubCase6 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 6: [{]




                    }else{
                        pSubCase6 = null;
                        mSubCase6 = null;
                    }
                    Pattern pSubCase7 = Pattern.compile("}");
                    Matcher mSubCase7 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 7: [}]




                    }else{
                        pSubCase7 = null;
                        mSubCase7 = null;
                    }
                    Pattern pSubCase8 = Pattern.compile("\\[");
                    Matcher mSubCase8 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 8: [[]




                    }else{
                        pSubCase8 = null;
                        mSubCase8 = null;
                    }
                    Pattern pSubCase9 = Pattern.compile("]");
                    Matcher mSubCase9 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 9: []]




                    }else{
                        pSubCase9 = null;
                        mSubCase9 = null;
                    }
                    Pattern pSubCase10 = Pattern.compile("/");
                    Matcher mSubCase10 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 10: [/]




                    }else{
                        pSubCase10 = null;
                        mSubCase10 = null;
                    }
                    Pattern pSubCase11 = Pattern.compile("\\*");
                    Matcher mSubCase11 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 11: [*]




                    }else{
                        pSubCase11 = null;
                        mSubCase11 = null;
                    }
                    Pattern pSubCase12 = Pattern.compile("-");
                    Matcher mSubCase12 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 12: [-]




                    }else{
                        pSubCase12 = null;
                        mSubCase12 = null;
                    }
                    Pattern pSubCase13 = Pattern.compile("\\+");
                    Matcher mSubCase13 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 13: [+]




                    }else{
                        pSubCase13 = null;
                        mSubCase13 = null;
                    }

                    Pattern pSubCase14 = Pattern.compile("@");
                    Matcher mSubCase14 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 14: [@]




                    }else{
                        pSubCase14 = null;
                        mSubCase14 = null;
                    }
                    Pattern pSubCase15 = Pattern.compile("\"");
                    Matcher mSubCase15 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 15: ["]




                    }else{
                        pSubCase15 = null;
                        mSubCase15 = null;
                    }
                    Pattern pSubCase16 = Pattern.compile("'");
                    Matcher mSubCase16 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 16: [']




                    }else{
                        pSubCase16 = null;
                        mSubCase16 = null;
                    }
                    Pattern pSubCase17 = Pattern.compile("\\|");
                    Matcher mSubCase17 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 17: [']




                    }else{
                        pSubCase17 = null;
                        mSubCase17 = null;
                    }
                    Pattern pSubCase18 = Pattern.compile("°");
                    Matcher mSubCase18 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 18: [°]




                    }else{
                        pSubCase18 = null;
                        mSubCase18 = null;
                    }
                    Pattern pSubCase19 = Pattern.compile("#");
                    Matcher mSubCase19 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 19: [#]




                    }else{
                        pSubCase19 = null;
                        mSubCase19 = null;
                    }
                    Pattern pSubCase20 = Pattern.compile("·");
                    Matcher mSubCase20 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 20: [·]




                    }else{
                        pSubCase20 = null;
                        mSubCase20 = null;
                    }
                    Pattern pSubCase21 = Pattern.compile("\\$");
                    Matcher mSubCase21 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 21: [$]




                    }else{
                        pSubCase21 = null;
                        mSubCase21 = null;
                    }
                    Pattern pSubCase22 = Pattern.compile("%");
                    Matcher mSubCase22 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 22: [%]




                    }else{
                        pSubCase22 = null;
                        mSubCase22 = null;
                    }
                    Pattern pSubCase23 = Pattern.compile("&");
                    Matcher mSubCase23 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 23: [&]




                    }else{
                        pSubCase23 = null;
                        mSubCase23 = null;
                    }
                    Pattern pSubCase24 = Pattern.compile("=");
                    Matcher mSubCase24 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 24: [=]




                    }else{
                        pSubCase24 = null;
                        mSubCase24 = null;
                    }
                    Pattern pSubCase25 = Pattern.compile("\\?");
                    Matcher mSubCase25 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 25: [?]




                    }else{
                        pSubCase25 = null;
                        mSubCase25 = null;
                    }
                    Pattern pSubCase26 = Pattern.compile("¿");
                    Matcher mSubCase26 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 26: [¿]




                    }else{
                        pSubCase26 = null;
                        mSubCase26 = null;
                    }
                    Pattern pSubCase27 = Pattern.compile("¡");
                    Matcher mSubCase27 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 27: [¡]




                    }else{
                        pSubCase27 = null;
                        mSubCase27 = null;
                    }
                    Pattern pSubCase28 = Pattern.compile("!");
                    Matcher mSubCase28 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 28: [!]




                    }else{
                        pSubCase28 = null;
                        mSubCase28 = null;
                    }
                    Pattern pSubCase29 = Pattern.compile("<");
                    Matcher mSubCase29 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 29: [<]




                    }else{
                        pSubCase29 = null;
                        mSubCase29 = null;
                    }
                    Pattern pSubCase30 = Pattern.compile(">");
                    Matcher mSubCase30 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 30: [>]




                    }else{
                        pSubCase30 = null;
                        mSubCase30 = null;
                    }
                    Pattern pSubCase31 = Pattern.compile("\\\\");
                    Matcher mSubCase31 = pSubCase1.matcher(currentField);
                    if(mSubCase1.find()){
                        //sub-cases 31: [>]




                    }else{
                        pSubCase31 = null;
                        mSubCase31 = null;
                    }
                }












                //regExp path [0-9]
                Pattern p = Pattern.compile(".+KEYCODE_B$", Pattern.CASE_INSENSITIVE);
                Matcher m = p.matcher(currentField);
                if(m.find()){
//                    //insert B
                    KeyEvent instanceKey = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_B);
                    try {
                        KeyEvent key = new KeyEvent(KeyEvent.ACTION_DOWN, f[i].getInt(instanceKey));
                        LOG.d(TAG, "execute dynamic field : " +  currentField + ", value : " + f[i].getInt(instanceKey));
                    this.getAppView().getView().dispatchKeyEvent(key);
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
//
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
