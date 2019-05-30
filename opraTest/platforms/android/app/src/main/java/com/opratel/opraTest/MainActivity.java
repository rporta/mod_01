/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.opratel.opraTest;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.darktalker.cordova.screenshot.Screenshot;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;
import android.telephony.TelephonyManager;
import java.lang.*;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends CordovaActivity {
    public Screenshot Screenshot;
    public static String TAG = "MainActivity";
    public String URL;
    public List URLList = new ArrayList();
    public  String PageStatus;
    public  boolean startFinishLoadPag = false;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml-
        try {
            Thread.sleep(2000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
//                loadUrl("http://www.tulandia.net/landing/LC6s9r?skipcookie=2");
        loadUrl(launchUrl);//aca ejecuta CordovaActivity.init(),
        //CordovaActivity.init() ejecuta makeWebView() y al final CordovaWebViewImpl.ini(cordovaInterface, pluginEntries, preferences)
        //makeWebView() retorna la instancia de CordovaWebViewImpl() que la almacena en CordovaActivity.appView
        //para construir la instancia de CordovaWebViewImpl(), se pasa como argumento la instancia de CordovaWebViewImpl.createEngine(), es decir
        //CordovaWebViewImpl(CordovaWebViewImpl.createEngine(context, ...))
        //
        //a donde va el contexto de CordovaActivity?
        //
        //el method CordovaWebViewImpl.createEngine(), le pasa el contexto de CordovaActivity  y retorna una instancia de SystemWebViewEngine,
        //el constructor de la clase SystemWebViewEngine, en base al contexto 'CordovaActivity' crea la instancia de SystemWebView,
        //SystemWebViewEngine realiza pasajes de parametros entre sus constructores, y finalmente en SystemWebViewEngine.webView se almacena la instancia de SystemWebView
        //al crear la instancia de SystemWebView, en el constructor, le pasa el conteto al super WebView y ejecuta el contructor de WebView
        //WebView extiende de MockView, al ejecutar el constructor de WebView, le pasa el conteto al super MockView (aca creo que es posible realizar recursion CordovaActivity <-> MockView),
        //la clase MockView viene del package

    }

    /*
     * RAMIRO PORTAS
     * ESTE METHOD SE LLAMA CUANDO SE DISPARA EL EVENTO AL CARGAR UNA NUEVA PAGINA
     * SE LLEGA A ESTE METHOD REALIZANDO Override DE CordovaActivity.onPageFinishedLoading()
     * EN CordovaWebViewImpl SE CREA EL CAMPO contextCordovaActivity
     * CUANDO SE EJECUTA CordovaWebViewImpl.init() - (@Override) se instancia CordovaWebViewImpl.EngineClient()
     * EN EL MISMO METHOD luego de la instancia CordovaWebViewImpl.EngineClient(), se ejecuta CordovaWebViewImpl.EngineClient.addContextCordovaActivity()
     * Y LE PASA EL CONTEXTO CordovaActivity.
     *
     * LOS CAMBIOS REALIZADOS SON
     * +CordovaWebViewImpl.EngineClient.addContextCordovaActivity() (NUEVO)
     * +CordovaWebViewImpl.EngineClient.contextCordovaActivity:CordovaActivity (NUEVO)
     * +CordovaWebViewImpl.contextCordovaActivity:CordovaActivity (NUEVO)
     * +CordovaWebViewImpl.CordovaWebViewImpl(CordovaActivity context, CordovaWebViewEngine cordovaWebViewEngine) (SE MODIFICO)
     * +CordovaActivity.makeWebView() (SE MODIFICO), //aca recien se pasa el contexto CordovaActivity
     * +CordovaActivity.onPageFinishedLoading() (NUEVO)
     * +MainActivity.onPageFinishedLoading() (NUEVO)
     *
     *
     * */

    @Override
    public void onPageFinishedLoading(String url) {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();

        this.URL = url;
        if(this.startFinishLoadPag == false){
            //aca por unica vez vamos a almacenar recurso local
            this.URLList.add(url);
            this.startFinishLoadPag = true;
        }{
            if((String) this.URLList.get(0) != this.URL){
                //solo almacenamos url enviadas por socket, cuando get() > 0
                this.URLList.add(url);
            }
        }


        if (url.indexOf("tulandia") != -1) {
            //se cargo la url de socket,
            //esperamos 2000ms por las dudas para no capturar si no termino de cargar la pagina
            try {
                Thread.sleep(2000);

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //tomamos una captura de la url
            cordovaInterface.pluginManager.exec("Screenshot", "saveScreenshot", "Screenshot1436522992", "[\"jpg\",50,\"opraTestScreenShot\"]");
            //esperamos 1000ms por las dudas de que el pluguin se demore al realizar la captura
            try {
                Thread.sleep(2000);

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //le decimos al navegador que cargue el recurso local (flujo web), pero con inyection javascript (flag)
            loadUrl((String) this.URLList.get(0));

            //aca le mandamos inyection javascript

            this.PageStatus = "cargamos flujo web por segunda vez";
        } else if(this.PageStatus == "cargamos flujo web por segunda vez"){
            String json = "{'mensaje' : 'volvemos por segunda vez' }"; //para definir las keys mejor usar comilla simple
            String js = "java.send('" + json + "')";
            this.appView.sendJavascript(js);
        } else {
            //se cargo el recurso local no hacer nada por ahora
            this.PageStatus = "cargamos flujo web por primera vez";

        }
    }
}
