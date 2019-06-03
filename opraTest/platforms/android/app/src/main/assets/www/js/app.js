/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var socket;

var app = {

    // Application Constructor
    initialize: function() {
        footer.setColorText(vueApp.colorText.green[5]);
        h.setText("app(javascript) : initialize ");

        document.body.children[0].addEventListener('touchstart', this.onTouchstart.bind(this), false);
        document.body.children[0].addEventListener('touchend', this.onTouchend.bind(this), false);
        document.body.children[0].addEventListener('touchmove', this.touchmove.bind(this), false);
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        footer.setColorText(vueApp.colorText.green[5]);
        h.setText("app(javascript) : onDeviceReady ");
        this.receivedEvent('deviceready');
    },
    onTouchstart: function(event) {
        footer.setColorText(vueApp.colorText.green[5]);
        h.setText("app(javascript) : onTouchstart ");
        touch.setShow(1);
        var coordenadas = new Object();
        coordenadas.x = event.touches[0].pageX;
        coordenadas.y = event.touches[0].pageY;
        h.setText(JSON.stringify(coordenadas));
        footer.setColorText(vueApp.colorText.cyan[12]);
        $(touch.$el).css("left", coordenadas.x);
        $(touch.$el).css("top", coordenadas.y);
    },
    onTouchend: function(event) {
        var coordenadas = new Object();
        coordenadas.x = event.touches[0].pageX;
        coordenadas.y = event.touches[0].pageY;
        h.setText(JSON.stringify(coordenadas));
        $(touch.$el).css("left", coordenadas.x);
        $(touch.$el).css("top", coordenadas.y);
    },
    touchmove: function(event) {
        var coordenadas = new Object();
        coordenadas.x = event.touches[0].pageX;
        coordenadas.y = event.touches[0].pageY;
        h.setText(JSON.stringify(coordenadas));
        $(touch.$el).css("left", coordenadas.x);
        $(touch.$el).css("top", coordenadas.y);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        //vamos a notificarle las dimenciones del flujo web al modulo app(Java)
        var height = $(vueApp.$el).height();
        var width = $(vueApp.$el).width();
        var dimension = new Object();
        dimension.width = width;
        dimension.height = height;
        var i = cordova.InAppBrowser.open("sendDataModuleApp");
        i.sendDataModuleApp(dimension);


        footer.setColorText(vueApp.colorText.green[5]);
        h.setText("app(javascript) : receivedEvent ");
        async.forever(function(next) {
            asyncResolveApp(null, function(err, data) {
                if (!err) {
                    footer.setColorText(vueApp.colorText.green[5]);
                    h.setText("step(" + data.step + ") : cb ");

                    //next step
                    setTimeout(function() {
                        footer.setColorText(vueApp.colorText.yellow[5]);
                        setTimeout(function() {
                            //init connect
                            if (rootConfig.dev.testTouch) {
                                testTouch(data, next);
                            } else {
                                initConnect(data, next);
                            }
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                } else {
                    h.setText("Error step(" + data.step + ") : cb " + data.error);
                    footer.setColorText(vueApp.colorText.red[5]);
                    //next step
                    setTimeout(function() {
                        footer.setColorText(vueApp.colorText.yellow[5]);
                        setTimeout(function() {
                            next(null, data);
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                }
            });
        });
    }
};

app.initialize();

/**
 * [asyncResolveApp description] Funcion que implementa async.waterfall
 * @param  {[type]}   data [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
var asyncResolveApp = function(data, cb) {
    var data = new Object();
    //vector de funciones
    var ini = new Array();

    //step : wifimanager
    ini.push((cb) => {
        (function ini(step, code, cantError) {
            data.step = step || 1;
            data.code = code || 99;
            data.cantError = cantError || 0;
        })(null, null, 0);

        footer.setColorText(vueApp.colorText.cyan[12]);
        h.setText("step(" + data.step + ") : wifimanager");

        data.wifi = appMobile.wifi.init();
        data.wifi.isWifiEnabled(function(err, rs) {
            setTimeout(function() {
                h.setText("wifi : isWifiEnabled()");
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    if (rs) {
                        footer.setColorText(vueApp.colorText.green[5]);
                        data.rsWifi = "enabled";
                        h.setText("wifi : enabled");

                    } else {
                        footer.setColorText(vueApp.colorText.red[5]);
                        data.rsWifi = "disabled";
                        h.setText("wifi : disabled");

                    }
                    //next step
                    setTimeout(function() {
                        setTimeout(function() {
                            cb(null, data);
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                }, rootConfig.interval);
            }, rootConfig.interval);
        });

    });

    //step : hasReadPermission
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(1);

        h.setText("step(" + data.step + ") : hasReadPermission");
        footer.setColorText(vueApp.colorText.cyan[12]);

        appMobile.sms.hasReadPermission(function(rs) {
            //rs
            //next step
            setTimeout(function() {
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    cb(null, data);
                }, rootConfig.interval);
            }, rootConfig.interval);
        }, function(err) {
            //err
            (function error(error) {
                data.code--;
                mensajeDefaut = 'Error en step(' + data.step + '), code : ' + data.code;
                data.error = error || mensajeDefaut;
            })("Error hasReadPermission : " + err);

            //next step
            setTimeout(function() {
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    cb(true, data);
                }, rootConfig.interval);
            }, rootConfig.interval);
        });
    });

    //step : requestReadPermission
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(1);

        h.setText("step(" + data.step + ") : requestReadPermission");
        footer.setColorText(vueApp.colorText.cyan[12]);

        appMobile.sms.requestReadPermission(function(rs) {
            //rs
            //next step
            setTimeout(function() {
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    cb(null, data);
                }, rootConfig.interval);
            }, rootConfig.interval);
        }, function(err) {
            //err
            (function error(error) {
                data.code--;
                mensajeDefaut = 'Error en step(' + data.step + '), code : ' + data.code;
                data.error = error || mensajeDefaut;
            })("Error requestReadPermission : " + err);

            //next step
            setTimeout(function() {
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    cb(true, data);
                }, rootConfig.interval);
            }, rootConfig.interval);
        });
    });

    //step : mensaje enviado por app(java)
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(0);

        h.setText("step(" + data.step + ") Mensaje desde app (JAVA) : " + appJava.mensaje);
        footer.setColorText(vueApp.colorText.cyan[12]);

        //next step
        setTimeout(function() {
            footer.setColorText(vueApp.colorText.yellow[5]);
            setTimeout(function() {
                cb(null, data);
            }, rootConfig.interval);
        }, rootConfig.interval);
    });

    //step : moveToBackground
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(0);

        h.setText("step(" + data.step + ") : moveToBackground");
        footer.setColorText(vueApp.colorText.cyan[12]);

        //next step
        setTimeout(function() {
            footer.setColorText(vueApp.colorText.yellow[5]);
            setTimeout(function() {
                //moveToBackground
                // appMobile.background.enable();
                // appMobile.background.moveToBackground();
                cb(null, data);
            }, rootConfig.interval);
        }, rootConfig.interval);
    });

    //step : getSmsLog
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(2);

        h.setText("step(" + data.step + ") : getSmsLog");
        footer.setColorText(vueApp.colorText.cyan[12]);

        if (appJava.mensaje === "") {
            let filters = [{
                "name": "body",
                "value": "StartProcess",
                "operator": "==",
            }];
            appMobile.sms.getSmsLog(filters, true, function(rs) {
                if (rs.length === 0) {
                    //err
                    (function error(error) {
                        data.code--;
                        mensajeDefaut = 'Error en step(' + data.step + '), code : ' + data.code;
                        data.error = error || mensajeDefaut;
                    })("Error getSmsLog : No se encontraron resultados");

                    //next step
                    setTimeout(function() {
                        footer.setColorText(vueApp.colorText.yellow[5]);
                        setTimeout(function() {
                            cb(true, data);
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                } else {
                    data.rsGetSmsLog = rs;
                    //next step
                    setTimeout(function() {
                        footer.setColorText(vueApp.colorText.yellow[5]);
                        setTimeout(function() {
                            cb(null, data);
                        }, rootConfig.interval);
                    }, rootConfig.interval);
                }
            }, function(err) {
                //err
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error getSmsLog : " + err);

                //next step
                setTimeout(function() {
                    footer.setColorText(vueApp.colorText.yellow[5]);
                    setTimeout(function() {
                        cb(true, data);
                    }, rootConfig.interval);
                }, rootConfig.interval);
            });
        } else {
            //aca se realizo inyection javascript desde la app al flujo web
            //next step
            setTimeout(function() {
                footer.setColorText(vueApp.colorText.yellow[5]);
                setTimeout(function() {
                    cb(null, data);
                }, rootConfig.interval);
            }, rootConfig.interval);

        }
    });

    //step : moveToForeground
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(0);



        //moveToForeground
        // appMobile.background.moveToForeground();

        if (appJava.mensaje === "") {
            h.setText("step(" + data.step + ") : moveToForeground, getSmsLog(" + data.rsGetSmsLog.length + ")");
            footer.setColorText(vueApp.colorText.cyan[12]);
        }


        //next step
        setTimeout(function() {
            footer.setColorText(vueApp.colorText.yellow[5]);
            setTimeout(function() {
                cb(null, data);
            }, rootConfig.interval);
        }, rootConfig.interval);

    });

    //step : rsGetSmsLog
    ini.push((data, cb) => {
        (function update(cantError) {
            data.step++;
            data.code -= data.cantError;
            data.cantError = cantError || 0;
        })(0);

        footer.setColorText(vueApp.colorText.cyan[12]);
        if (appJava.mensaje === "") {
            for (var x in data.rsGetSmsLog) {
                var currentRs = data.rsGetSmsLog[x];
                h.setText(currentRs);
            }
        }

        //next step
        setTimeout(function() {
            footer.setColorText(vueApp.colorText.yellow[5]);
            setTimeout(function() {
                cb(null, data);
            }, rootConfig.interval);
        }, rootConfig.interval);

    });

    //funcion final
    var final = (err, data) => {
        err
            ?
            (() => {
                h.setText("Error step(" + data.step + ") final : " + data.error);
                footer.setColorText(vueApp.colorText.red[5]);

                //next step
                setTimeout(function() {
                    footer.setColorText(vueApp.colorText.yellow[5]);
                    setTimeout(function() {
                        cb(true, data);
                    }, rootConfig.interval);
                }, rootConfig.interval);
            })() :
            (() => {

                h.setText("step(" + data.step + ") : final");
                footer.setColorText(vueApp.colorText.green[5]);

                //next step
                setTimeout(function() {
                    footer.setColorText(vueApp.colorText.yellow[5]);
                    setTimeout(function() {
                        cb(null, data);
                    }, rootConfig.interval);
                }, rootConfig.interval);
            })();
    };

    //registro vector funciones, funcion final
    async.waterfall(ini, final);
}