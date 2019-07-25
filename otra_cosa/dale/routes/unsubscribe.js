var express = require('express');
var router = express.Router();
var async = require('async');

var operator, logger, opradb, redis, helper, config, mssql, configOperator;

/*
    Resumen de lo charlado
    0- los parametros que va a recibir tu endpoint son: msisdn, medioId y paqueteId
    1- con medioId y paqueteId, debes levantar el serviceId que le corresponda, ese mapeo armalo incialmente en config/anteluy.json
    2- una vez que cuentes con el serviceId, haces el isActive
    3- si contas con todos los datos, le pegas al endpoint del operador para realizar la desuscripcion y propagas la respuesta hacia atras.
 */
router.post('/', (req, res, next) => {
    // load req.app.locals
    operator = req.app.locals.operator;
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    redis = req.app.locals.redis;
    helper = req.app.locals.helper;
    config = req.app.locals.config;
    mssql = req.app.locals.mssql;
    // configOperator = require(__dirname + '/config/' + config.operator['auy']);

    /**
     * Ramiro Portas : #1
     * (1) cargo a reqFull (path, headers, body)
     */
    var reqFull = {}
    reqFull.path = req.params;
    reqFull.headers = req.headers;
    reqFull.body = req.body;

    logger.info('Request method ' + '(/unsubscribe)' + ' : ' + JSON.stringify(reqFull));

    //#1
    asyncUnsubscribe(reqFull, (err, data) => {
        var response = {
            mensaje: null,
            code: 0
        };
        if (err) {
            response.mensaje = data.error;
            response.code = 400;
        } else {
            response.mensaje = data.rs;
            response.code = 200;
        }
        logger.info('Response method ' + '(/unsubscribe)' + ' : ' + JSON.stringify(response));
        res.status(response.code).send(response.mensaje);
    });
});

var asyncUnsubscribe = (data, cb) => {
    //vector de funciones
    var ini = [
        (cb) => {
            (function ini(step, code, cantError) {
                data.step = step || 1;
                data.code = code || 99;
                data.cantError = cantError || 0;
            })(null, null, 1);
            // valido parametros en body msisdn, medioId, paqueteId
            if (!data.body.msisdn || !data.body.msisdn.medioId || !data.body.msisdn.paqueteId) {
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error en body, falta algun parametro (msisdn, medioId, paqueteId)");
                cb(true, data);
            } else {
                data.msisdn = data.body.msisdn;
                data.medioid = data.body.medioId;
                data.paqueteid = data.body.paqueteId;
                cb(false, data);
            }
        },
        (data, cb) => {
            (function update(cantError) {
                data.step++;
                data.code -= data.cantError;
                data.cantError = cantError || 0;
            })(1);
            try {
                // map, para obtener serviceId, portalId
                data.serviceId = operator.serviceMap[data.medioid][data.paqueteId].serviceId;
                data.portalId = operator.serviceMap[data.medioid][data.paqueteId].portalId;
                cb(false, data);
            } catch (e) {
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error de mapeo");
                cb(true, data);
            }
        },
        (data, cb) => {
            (function update(cantError) {
                data.step++;
                data.code -= data.cantError;
                data.cantError = cantError || 0;
            })(3);
            try {
                // consulta isactive
                opradb.isActive(data, function(err, rs) {
                    if (!err) {
                        if (rs) {
                            cb(false, data);
                        } else {
                            (function error(error) {
                                data.code--;
                                mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                                data.error = error || mensajeDefaut;
                            })("Error al realizar la consuta isactive");
                            cb(true, data);
                        }
                    } else {
                        (function error(error) {
                            data.code--;
                            mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                            data.error = error || mensajeDefaut;
                        })("Error al realizar la consuta isactive");
                        cb(true, data);
                    }
                });
            } catch (e) {
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error al realizar la consuta isactive");
                cb(true, data);
            }
        },
        (data, cb) => {
            (function update(cantError) {
                data.step++;
                data.code -= data.cantError;
                data.cantError = cantError || 0;
            })(3);
            var postData = {
                movil: data.msisdn,
                portal: data.portalId,
                servicio: data.serviceId
            }
            var postRequest = {
                url: operator.url.unsubscribe,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }
            logger.debug('Validate post request: ' + JSON.stringify(postRequest));

            //contra la API realizar la desuscripcion

            try {
                request(postRequest, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        logger.debug(response.body);
                        body = JSON.parse(body);
                        if (typeof body.status == 'undefined' || body.status == 'false') {
                            if (body.status == 'false' && typeof body.error != 'undefined') {
                                logger.error('Unsubscription | API failure: ' + body.error + ' | Request: ' + JSON.stringify(postData));
                            } else {
                                logger.error('Unsubscription | API failure | Request: ' + JSON.stringify(postData));
                            }
                            cb(true, data);
                        } else {
                            logger.info('Unsubscription | API success | Msisdn: ' + JSON.stringify(postData));
                            cb(false, data);
                        }

                    } else {
                        logger.error('Unsubscription | API failure | Request: ' + JSON.stringify(postData) + ' | Response: ' + response.body);
                        cb(true, data);
                    }
                });

            } catch (e) {
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error contra la API : " + e);
                cb(true, data);
            }
        },
    ];
    // funcion final resolve response
    var final = (err, data) => {
        if (err) {
            logger.error(data.error);
            cb(true, data);
        } else {
            cb(false, data);
        }
    };
    //registro vector funciones, funcion final
    async.waterfall(ini, final);
}

module.exports = router;