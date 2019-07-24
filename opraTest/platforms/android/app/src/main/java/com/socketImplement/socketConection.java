package com.socketImplement;

import org.apache.cordova.LOG;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.Socket;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;
import java.net.URISyntaxException;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.emitter.Emitter;

public class socketConection {

    public JSONObject data;

    public static String TAG = "socketConection";
    private String host;
    private int port;
    private com.github.nkzawa.socketio.client.Socket socket;
    private Emitter.Listener onNewMessage;

    public socketConection(){
        this(null, 0);
    }

    public socketConection (String host, int port){
        this.host = host;
        this.port = port;
    }

    public String getHost() {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        return this.host;
    }

    public int getPort() {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        return this.port;
    }

    public void sethost(String host) {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        this.host = host;
    }

    public void setPort(int port) {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        this.port = port;
    }

    public com.github.nkzawa.socketio.client.Socket getSocket() {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        return this.socket;
    }

    public void setSocket(com.github.nkzawa.socketio.client.Socket socket) {
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        this.socket = socket;
    }

    public void init(){
        String nameofCurrMethod = new Throwable()
                .getStackTrace()[0]
                .getMethodName();
        try {
            this.setSocket(IO.socket("http://" + this.getHost() + ":" + this.getPort()));
            this.connect();
            this.listeningOnEvents();
        } catch (URISyntaxException e) {

        }
    }

    public void listeningOnEvents(){

        //ss nos avisa que conectamos, debemos init
        this.getSocket().on("connect", new Emitter.Listener() {
            @Override
            public void call(Object... args) {

                JSONObject data = (JSONObject) args[0];
                setData(data);
                LOG.d(TAG, "fafa" + getData());
                emitInit();//le enviamos a ss wifistate, id
            }
        });



        //ss nos envia la url para cargar en la app, debemos emitir
        this.getSocket().on("processUrl", new Emitter.Listener() {
            @Override
            public void call(Object... args) {

                JSONObject data = (JSONObject) args[0];
                setData(data);
                LOG.d(TAG, "fafa" + getData());
                emitProcessResponse();//le enviamos a ss la captura

            }
        });

        //ss nos envia un array de processEvent
        this.getSocket().on("processEvent", new Emitter.Listener() {
            @Override
            public void call(Object... args) {

                JSONObject data = (JSONObject) args[0];
                setData(data);
                LOG.d(TAG, "fafa" + getData());
                resolveProcesEvent();//realiza los touch y carga de datos
                emitProcessResponse();//le enviamos a ss la captura
            }
        });
        //ss nos envia la orden que desconectemos
        this.getSocket().on("disconnect", new Emitter.Listener() {
            @Override
            public void call(Object... args) {

                JSONObject data = (JSONObject) args[0];
                setData(data);
                LOG.d(TAG, "onDisconnect" + getData());
                emitDisconnect();
            }
        });

    }
    public void resolveProcesEvent(){

    }

    public void emitProcessResponse(){//enviamos la captura

        this.sendEvent("processResponse", "data");
    }
    public void emitDisconnect(){
        this.sendEvent("disconnect", "true");
    }
    public void emitInit(){
        this.sendEvent("Init", "data");
    }
    public void sendEvent(String event, Object... data){
        this.getSocket().emit(event, data);
    }

    public void connect(){
        this.getSocket().connect();
    }

    public void setData(JSONObject data) {
        this.data = data;
    }

    public JSONObject getData() {
        return data;
    }
}
