var express = require('express');
var router = express.Router();
var async = require('async');

var operator, logger, opradb, redis, helper, config, mssql, configOperator;

/**
 * RAMIRO PORTA
 * Este controlador, debe recibir en req.body
 *     {
 *         "movil": "string",
 *         "portal": "string",
 *         "servicio": "string"
 *     }
 * resuelve 
 * y debe contestar un string
 *
 * mas info 
 *     http://api-dale.sva.antel.com.uy/swagger-ui.html#!/Suscripciones/cancelarSuscripcionUsingPOST
 */



/*
    *cree la ruta cancelarSuscripcion.js
    *agregue la ruta al server.js
    *en la ruta valido que lleguen body con lo que pide swagger, sino respondo error,
    *si llego ok body, entonces realiza el void,
    *luego del void prepare las respuestas tal como define swagger,
    pero me esta faltando resolver el void, y aca la pregunta
    //los datos que me postean lo define Benja

    1. mapear, ver daleMap, en omanager
    2. consulta a db.isActive, si hay ok pasa step 2 sino respondo error tal como define swagger,
    3. realizar la cancelación, esto lo resuelvo contra otro endPoint http://api-dale.sva.antel.com.uy/cancelarSuscripcion?, de ser así en función de la respuesta contra la API prepare las respuestas tal como define swagger,

    Resumen de lo charlado
    0- los parametros que va a recibir tu endpoint son: msisdn, medioId y paqueteId ------------------ OK
    1- con medioId y paqueteId, debes levantar el serviceId que le corresponda, ese mapeo armalo incialmente en config/anteluy.json--------1
    2- una vez que cuentes con el serviceId, haces el isActive----------------2
    3- si contas con todos los datos, le pegas al endpoint del operador para realizar la desuscripcion y propagas la respuesta hacia atras.---3
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
    configOperator = require(__dirname + '/config/' + config.operator['auy']);

    /**
     * Ramiro Portas : #1
     * (1) cargo a reqFull (path, headers, body)
     */
    var reqFull = {}
    reqFull.path = req.params;
    reqFull.headers = req.headers;
    reqFull.body = req.body;

    logger.info('Request method ' + '(/cancelarSuscripcion)' + ' : ' + JSON.stringify(reqFull));

    //#1
    asyncCancelarSuscripcion(reqFull, (err, data) => {
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
        logger.info('Response method ' + '(/cancelarSuscripcion)' + ' : ' + JSON.stringify(response));
        res.status(response.code).send(response.mensaje);
    });
});

var asyncCancelarSuscripcion = (data, cb) => {
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
                // map
                data.serviceId = configOperator.serviceMap[data.body.medioId][data.body.paqueteId].serviceId;

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
            })(1);
            try {
                // isactive
                opradb.isActive(data, function(err, rs) {
                    if (!err) {
                        if (rs) {
                            cb(true);
                        } else {
                            cb(null, data);
                        }
                    } else {
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
            })(1);
            try {
                // realizar la cancelación, esto lo resuelvo contra otro endPoint
                var postRequest = {
                    method: mw.method,
                    body: postData,
                    json: true,
                    url: mw.protocolo + mw.host + '/' + mw.path,
                    headers: {
                        'Authorization': 'Bearer ' + mw.apiKey
                    }
                };
                var req = request(postRequest, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        data.ApiRs = {};
                        data.ApiRs.error = error;
                        data.ApiRs.response = response;
                        data.ApiRs.body = body;
                        cb(false, data);
                    }
                });
            } catch (e) {
                (function error(error) {
                    data.code--;
                    mensajeDefaut = 'Error en step(' + data.step + '), code: ' + data.code;
                    data.error = error || mensajeDefaut;
                })("Error contra la API");
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