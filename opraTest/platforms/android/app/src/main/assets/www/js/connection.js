var socket;

var testTouch = (beforeData, next) => {
    footer.setColorText(vueApp.colorText.cyan[12]);
    h.setText("test input from module app(JAVA)");
    // button.setShow(1);
    // input.setShow(1);
}

var initConnect = (beforeData, next) => {
    h.setText("new socket connect");


};

var initConnectDisabled = (beforeData, next) => {

    //create instance socket
    socket = appMobile.socket.newSocket(rootConfig.api.host, rootConfig.api.port);

    //en caso de que socket no conecte mostramos el estado del socket
    if (!socket.connected) {
        footer.setColorText(vueApp.colorText.red[5]);
        h.setText("socket connect : " + socket.connected);
    }

    //register events socket [connect, processUrl, processEvent, disconnect]
    socket.on('connect', function() {
        h.setText("socket : connect");

        var deviceData = new Array();
        deviceData.push(device.serial);
        deviceData.push(device.manufacturer);
        deviceData.push(device.model);

        var tempID = deviceData.join("-");

        footer.setColorText(vueApp.colorText.cyan[12]);
        socket.emit("init", {
            "wifistate": beforeData.rsWifi,
            "id": tempID
        });
    });
    socket.on('processUrl', function(data) {
        h.setText("socket : processUrl");
        footer.setColorText(vueApp.colorText.cyan[12]);
        h.setText("socket : url -> " + data.loadUrl);

        if (appJava.mensaje === "") {
            /**
             * processUrl
             * 
             * 1) socket envia loadUrl 
             * 2) flujo web le avisa al plugin de cordova que cargue la url enviada por el socket
             * 3) fin flujo flujo web -----------------
             * 4) app (JAVA) realiza una captura de la pantalla
             * 5) app (JAVA) vuelve a cargar el flujo web, con inyection javascript (flag: volvemos por segunda vez)
             */
            //------------------------------------------------------comentario temporal-------------------

            h.setText("socket : url -> " + data.loadUrl);
            var ref = cordova.InAppBrowser.open(data.loadUrl, '_self', 'location=no');

            //------------------------------------------------------comentario temporal------------------- 



        } else if (appJava.mensaje === "volvemos por segunda vez") {
            /**
             * processUrl
             * 
             * 1) socket envia loadUr, que la tenemos registrada en el app(java)
             * 2) flujo web, llama al plugin cordova para recuperar la capura realizada por app (java)
             * 3) flujo web, envia la captura al socket
             */
            appMobile.screenshot.URI(function(err, res) {
                if (!err) {
                    //envio captura al socket luego de 5000 ms
                    setTimeout(function() {
                        var socketData = new Object();
                        socketData.screenCapture = res.URI;
                        socketData.attributes = new Object();
                        socketData.attributes.width = "1920";
                        socketData.attributes.height = "1080";
                        socket.emit("processResponse", socketData);


                    }, 5000);
                } else {
                    //reset Flujo web
                    h.setText(err);
                    footer.setColorText(vueApp.colorText.red[5]);
                    //next step
                    setTimeout(function() {
                        footer.setColorText(vueApp.colorText.yellow[5]);
                        setTimeout(function() {
                            next();
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                }
            }, 50);
        }
    });
    socket.on('processEvent', function(data) {
        h.setText("socket : processEvent");
        footer.setColorText(vueApp.colorText.cyan[12]);

        /**
         * processEvent
         * 
         * 1) socket envia coordenadas (x, y) || socket envia coordenadas (x, y), text 
         * 2) flujo Web le envia la informacion que llego del socket, a la app (java)
         * 3) flujo web le avisa al plugin de cordova que cargue la url enviada por el socket
         * 5) fin flujo Web -----------------
         * 6) app(java), implementa casos 1, 2
         * 7) app(java), llama al plugin para realizar captura
         * 8) app(java), carga nuevamente el flujo web, con inyection javascript (flag 2)
         */

        if (data.text.constructor.name = "String" && data.text.length > 0) {

            //case (2) : socket envia coordenadas (x, y), text 

            // (2) flujo Web le envia la informacion que llego del socket, a la app (java)
            var i = cordova.InAppBrowser.open("sendDataModuleApp");

            var dataSocket = new Object();

            dataSocket.x = data.click.x
            dataSocket.y = data.click.y;
            dataSocket.text = data.text;

            i.sendDataModuleApp(dataSocket);

        } else {

            //case (1) : socket envia coordenadas (x, y)

            // (2) flujo Web le envia la informacion que llego del socket, a la app (java)
            var i = cordova.InAppBrowser.open("sendDataModuleApp");

            var dataSocket = new Object();

            dataSocket.x = data.click.x
            dataSocket.y = data.click.y;

            i.sendDataModuleApp(dataSocket);

        }
    });
    socket.on('disconnect', function() {
        h.setText("socket : disconnect");
        footer.setColorText(vueApp.colorText.cyan[12]);
        socket.emit("disconnect", true);

        //next step
        setTimeout(function() {
            footer.setColorText(vueApp.colorText.yellow[5]);
            setTimeout(function() {
                next();
            }, rootConfig.interval);
        }, rootConfig.interval);
    });
};

var dimension = new Object();