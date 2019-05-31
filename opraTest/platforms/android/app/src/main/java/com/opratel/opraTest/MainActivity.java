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

import android.os.Bundle;

import org.apache.cordova.*;

import org.json.JSONObject;


import java.lang.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends CordovaActivity {
    public static String TAG = "MainActivity";
    public String URL;
    public List URLList = new ArrayList();
    public String PageStatus;
    public boolean startFinishLoadPag = false;
    public String dataFW;
    public Integer resolveCase;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml-

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
            //finalizo la carga url local, iniciamos por primera vez, aun no inicia el flujo web
            this.URLList.add(url);
            this.startFinishLoadPag = true;
            this.PageStatus = "Inicializamos";
        }else {
            if(url.indexOf("file") != -1){
                //finalizo la carga url local, realizamos inyection javascript (flag), aun no inicia el flujo web
                if (this.PageStatus == "volvemos por segunda vez"){
                    String json = "{'mensaje' : '"+ this.PageStatus +"' }";
                    String js = "javascript:java.send(" + json + ")";
                    this.appView.loadUrl(js);

                }
            }else{
                //finalizo la carga url remota
                this.URLList.add(url);
                if(this.PageStatus == "Inicializamos"){
                    //finalizo la carga url remota por primera vez, realizamos captura de URL, realizamos captura, volvemos a cargar el recurso local
                    this.PageStatus = "volvemos por segunda vez";


                    //creo un delay, para para lanzar la captura
                    TimerTask task = new TimerTask() {
                        public void run() {
                            cordovaInterface.pluginManager.exec("Screenshot", "saveScreenshot", "", "[\"jpg\",50,\"opraTestScreenShot\"]");
                            loadUrl((String) URLList.get(0));
                        }
                    };
                    long delay = 1000L;
                    Timer timer = new Timer("Screenshot");
                    timer.schedule(task, delay);

                    task = null;
                    timer = null;

                }else if (this.PageStatus == "volvemos por segunda vez"){
                    //finalizo la carga url remota por segunda vez, realizamos casos (CASO 1, CASO2), realizamos captura, volvemos a cargar el recurso local
                    if(this.resolveCase == 1){
                        //caso 1
                        try{

                            JSONObject JsonDataFW = (new JSONObject(dataFW));
                            //preparo caso 1
                            Integer x = JsonDataFW.getInt("x");
                            Integer y = JsonDataFW.getInt("y");
                            String ParamFocus = "{\"top\":0,\"left\":0,\"right\":" + x + ",\"bottom\":"+ y +"}";
                            //realizamos toch
                            cordovaInterface.pluginManager.exec("Focus", "focus", "", "[" + ParamFocus + "]");

                            //creo un delay, para para lanzar la captura
                            TimerTask task = new TimerTask() {
                                public void run() {
                                    cordovaInterface.pluginManager.exec("Screenshot", "saveScreenshot", "", "[\"jpg\",50,\"opraTestScreenShot\"]");
                                    loadUrl((String) URLList.get(0));
                                }
                            };
                            long delay = 1000L;
                            Timer timer = new Timer("Screenshot");
                            timer.schedule(task, delay);

                            task = null;
                            timer = null;

                        }catch (Exception e){

                        }
                    }else if (this.resolveCase == 2){
                        //caso 2
                        try{

                            JSONObject JsonDataFW = (new JSONObject(dataFW));
                            //preparo caso 2
                            Integer x = JsonDataFW.getInt("x");
                            Integer y = JsonDataFW.getInt("y");
                            String text = JsonDataFW.getString("text");


                            //creo un delay, para para lanzar la captura
                            TimerTask task = new TimerTask() {
                                public void run() {
                                    cordovaInterface.pluginManager.exec("Screenshot", "saveScreenshot", "", "[\"jpg\",50,\"opraTestScreenShot\"]");
                                    loadUrl((String) URLList.get(0));
                                }
                            };
                            long delay = 1000L;
                            Timer timer = new Timer("Screenshot");
                            timer.schedule(task, delay);

                            task = null;
                            timer = null;

                        }catch (Exception e){

                        }
                    }
                }

            }
        }
    }
    /*
     * RAMIRO PORTAS
     * ESTE METHOD SE INVOCA CUANDO FLUJO WEB ENVIA DATA AL MODULO APP(JAVA)
     * */

    @Override
    public void onDataFW(String dataFW){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        this.dataFW = dataFW;

        if(URL.indexOf("file") != -1){
            //Aca el recurso local me esta enviando la data del socket
            if(this.PageStatus == "volvemos por segunda vez"){

                if(dataFW.indexOf("text") != -1){
                    //caso 2 touch y data para cargar en input: coordenadas(x, y ), data
                    LOG.d(TAG, nameofCurrMethod + ", dataFW caso 2: " + dataFW );
                    this.resolveCase = 2;

                }else{
                    //caso 1 touch : url, coordenadas(x, y )

                    LOG.d(TAG, nameofCurrMethod + ", dataFW caso 1: " + dataFW );
                    this.resolveCase = 1;
                }
                loadUrl((String) URLList.get(this.URLList.size() - 1));//aca siempre cargamos la ultima URL, remota
            }
        }
    }

}
