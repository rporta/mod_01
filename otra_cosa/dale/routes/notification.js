var express = require('express');
var router = express.Router({mergeParams: true});
var medios = require('/var/resources/medios');
var async = require('async');
var utils = require('../../libs/utils');
var util = require('util');
var request = require('request');

var logger, opradb, config, mssql, helper, operator;

router.post('/subscribe', function(req, res, next) {
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;
    if(typeof req.params.oid != 'undefined' && helper.operatorExists(req.params.oid)){
        operator = require(__dirname + '/../config/' + config.operator[req.params.oid]);

        // res.sendStatus(200);
        if (typeof req.body.movil != 'undefined' && typeof req.body.servicio != 'undefined') {
            alta(req.body, function(err, data) {
                //if (err) {
                //    res.status(400).send('Request error');
                //} else {
                    res.status(200).send({ "statusCode": 200, "message": "Suscripcion exitosa" });
                //}
            });
        } else {
            res.status(400).send({"statusCode": 400, "message": "Uno o mas parametros no fueron proporcionados"});
        }
    }else{
        res.status(404).send({"statusCode": 404, "message": "Pagina inexistente"});
    }
});
router.post('/unsubscribe', function(req, res, next) {
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;
    if(typeof req.params.oid != 'undefined' && helper.operatorExists(req.params.oid)){
        operator = require(__dirname + '/../config/' + config.operator[req.params.oid]);

        if (typeof req.body.movil != 'undefined' && typeof req.body.servicio != 'undefined') {
            baja(req.body, function(err, data) {
                if (err) {
                    res.status(400).send({"statusCode": 400, "message": "Error al procesar su solicitud"});
                } else {
                    res.status(200).send({"statusCode": 200, "message": "Desuscripcion exitosa"});
                }
            });
        } else {
            res.status(400).send({"statusCode": 400, "message": "Uno o mas parametros no fueron proporcionados"});
        }
    }else{
        res.status(404).send({"statusCode": 404, "message": "Pagina inexistente"});
    }
});
router.post('/bill', function(req, res, next) {
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;
    if(typeof req.params.oid != 'undefined' && helper.operatorExists(req.params.oid)){
        operator = require(__dirname + '/../config/' + config.operator[req.params.oid]);

        if (typeof req.body.transaccion != 'undefined' && typeof req.body.cobroExitoso != 'undefined') {
            bill(req.body, function(err, data) {
                if (err) {
                    res.status(400).send({"statusCode": 400, "message": "Request error"});
                } else {
                    res.status(200).send({"statusCode": 200, "message": "Notificación exitosa"});
                }
            });
        } else {
            res.status(400).send({"statusCode": 400, "message": "Request error"});
        }

    }else{
        res.status(404).send({"statusCode": 404, "message": "Pagina inexistente"});
    }
});



function alta(data, callback){
    logger.debug('Alta raw request: ' + JSON.stringify(data));
    data.sponsorid = operator.sponsorId;
    data.msisdn = data.movil;
    if (data.msisdn.substr(0,1) == '0') {
        data.msisdn = '598' + data.msisdn.substr(1);
    }
    // data.shortcode = data.shortCode;
    async.waterfall([
        function(cb){
            getDaleMap(data, function(err, rs) {
                //console.log(JSON.stringify(rs));
                if (!err){
                    data.medios = medios[rs.MedioId];
                    data.aplicacionid = rs.AplicacionId;
                    data.portalid = rs.PortalId;
                    data.keyword = rs.Keyword;
                    cb(null, data);
                }else{
                    cb(true);
                }
            });
        },
        function(data, cb){
            getPaquete(data, function(err, data){
                if (!err){
                    cb(null, data);
                }else{
                    logger.error('Unable to get paquete: ' + JSON.stringify(data));
                    cb(true);
                }
            });
        },
        function(data, cb){
            data.medioid = data.medios.charge.MedioId;
            opradb.isActive(data, function(err, rs){
                if (!err){
                    if (rs) {
                        cb(true);
                    } else {
                        cb(null, data);
                    }
                }else{
                    logger.error('Unable to get subscription status: ' + JSON.stringify(data));
                    cb(true);
                }
            });
        },
        function(data, cb){
            if (operator.enabledSMS.indexOf(data.aplicacionid) >= 0 ){
                data.urlRequest = operator.url.wasSubscribe.replace('{msisdn}', data.movil);
                requestWas(data, function(err, data){
                    if (!err) {
                        cb(null, data);
                    } else {
                        logger.error('Unable to validate subscription with Was: ' + JSON.stringify(data));
                        cb(true);
                    }
                });
            }else{
                cb(null, data);
            }
        },
        function(data, cb){
            data.medioid = data.medios.free.MedioId;
            data.shortcode = data.medios.free.Medio;
            opradb.insertMO(data, {}, function(err, data){
                if (!err && data.entradaid > 0) {
                    cb(null, data);
                } else {
                    logger.error('Unable to insert MO: ' + JSON.stringify(data));
                    cb(true);
                }
            });
        }],
        function(err, data){
            var response;
            if (!err){
                logger.info('Alta - MO inserted. Msisdn: ' + data.msisdn + ' | Keyword: ' + data.keyword + ' | ShortCode: ' + data.shortcode);
                logger.debug('Alta - Record: ' + JSON.stringify(data));
                callback(null);
            }else{
                logger.error('Alta - Exiting with error');
                callback(true);
            }
        }
    );

}

function baja(data, callback){
    logger.debug('Baja raw request: ' + JSON.stringify(data));
    data.sponsorid = operator.sponsorId;
    data.msisdn = data.movil;
    if (data.msisdn.substr(0,1) == '0') {
        data.msisdn = '598' + data.msisdn.substr(1);
    }

    async.waterfall([
        function(cb){
            getDaleMap(data, function(err, rs) {
                logger.debug('daleMap: ' + JSON.stringify(rs));
                if (!err){
                    data.medios = medios[rs.MedioId];
                    data.aplicacionid = rs.AplicacionId;
                    data.portalid = rs.PortalId;
		            data.kwFromDaleMap = rs.Keyword;
                    data.keyword = rs.Keyword;
                    cb(null, data);
                }else{
                    cb(true);
                }
            });
        },
        function(data, cb){
            var params = {
                msisdn: data.msisdn,
                medioid: data.medios.charge.MedioId
            }
            opradb.getActiveSubscriptions(data, function(err, data){
                if (!err && typeof data.subscriptions !== 'undefined' && data.subscriptions.length > 0) {
                    cb(null, data);
                } else {
                    cb(true);
                }
            });
        },
        function(data, cb){
            if (operator.enabledSMS.indexOf(data.aplicacionid) >= 0 ){
                data.urlRequest = operator.url.wasUnsubscribe.replace('{msisdn}', data.movil);
                requestWas(data, function(err, data){
                    if (err) {
                        logger.error('Unable to validate unsubscription with Was: ' + JSON.stringify(data));
                    }
                    cb(null, data);
                });
            }else{
                cb(null, data);
            }
        },
        function(data, cb){
            data.medioid = data.medios.free.MedioId;
	    //data.medioid = data.MedioId || data.medios.charge.MedioId;
            data.shortcode = data.medios.charge.Medio;
            data.aplicacionid = 7;
            // data.keyword = operator.ws.unsubscriptionKeyword + ' ' + data.keyword;
            data.keyword = 'baja ' + data.keyword;
            opradb.insertMO(data, {}, function(err, data){
                if (!err && data.entradaid > 0) {
                    cb(null, data);
                } else {
                    logger.error('Unable to insert MO: ' + JSON.stringify(data));
                    cb(true);
                }
            });
        }],
        function(err, data){
            var response;
            if (!err){
                logger.info('Baja - MO inserted. Msisdn: ' + data.msisdn + ' | ShortCode: ' + data.shortcode);
                logger.debug('Baja - Record: ' + JSON.stringify(data));
                callback(null);
            }else{
                logger.error('Baja - Exiting with error');
                callback(true);
            }

        }
    );

}

function bill(data, callback){
    logger.debug('Bill raw request: ' + JSON.stringify(data));
    data.sponsorid = operator.sponsorId;
    data.salidaid = data.transaccion;
    data.estado = null;

    async.waterfall([
        function(cb){
            getMT(data, function(err, rs) {
                //console.log(JSON.stringify(rs));
                if (!err){
                    data.medios = medios[rs.MedioId];
                    data.msisdn = rs.Destino;
                    data.mt = rs;
                    cb(null, data);
                }else{
                    cb(true);
                }
            });
        },
        function(data, cb) {
            data.estadoesid = (data.cobroExitoso == true) ? 3 : 18;
            data.estado = data.estadoesid; // para persistir al log
            opradb.updateMT(data, function(err, data){
                if (err) {
                    logger.error('Error update Salida ' + JSON.stringify(data));
                    cb(true, data);
                } else {
                    cb(null, data);
                }
            });
        }],
	/*#9223 no enviamos mas MTs de renovacion
        function(data, cb){
            // insert free MT
            if (data.estadoesid == 3) {
                data.nocharge = 1;
                data.estadoesid = 1;
                data.medioid = data.medios.free.MedioId;
                data.shortcode = data.medios.free.Medio;
                data.contenido = data.mt.Contenido;
                data.entradaid = data.mt.EntradaId;
                data.aplicacionid = data.mt.AplicacionId;
                data.suscripcionid = data.mt.SuscripcionId;
                data.mds = data.mt.Relacion;
                data.prioridad = data.mt.Prioridad;
                data.rebotado = data.mt.Rebotado;

                opradb.insertMT(data, function(err, data){
                    if (!err) {
                        // logText = logText + ' | Free MT Id: ' + data.salidaid;
                        cb(null, data);
                    } else {
                        cb(true, data);
                    }
                });
            } else {
                cb(null, data);
            }
        }],*/
        function(err, data){
            if (!err){
                var estado = (data.estado == 3) ? 'Cobrado' : 'No cobrado';
                var logText = 'Bill - MT updated. Msisdn: ' + data.msisdn + ' | SalidaId: ' + data.transaccion + ' | Estado: ' + estado;
                if (data.salidaid != data.transaccion) {
                    logText = logText + ' | SalidaId (free): ' + data.salidaid;
                }
                logger.info(logText);
                logger.debug('Bill - Record: ' + JSON.stringify(data));
                callback(null);
            }else{
                logger.error('Bill - Exiting with error');
                callback(true);
            }
        }
    );

}

function getDaleMap(data, callback){
    logger.debug('Getting dalemap...');
    var query = util.format("select * from OpratelCenter.dbo.DaleMap with(nolock) where SponsorId = %d and ServiceId = '%s' AND enabled = 1", data.sponsorid, data.servicio);
    // console.log(query);
    mssql.query(query, function(rs) {
        if (rs && rs.length > 0) {
            callback(null, rs[0]);
        }else{
            logger.error('No DaleMap found based on sponsor and servicio: ' + JSON.stringify(data));
            callback(true);
        }
    });
}

function getMT(data, callback){
    logger.debug('Getting MT...');
    var query = util.format('select * from OpratelCenter.dbo.Salida with(nolock) where SalidaId = %d and SponsorId = %d', data.transaccion, data.sponsorid);
    // console.log(query);
    mssql.query(query, function(rs) {
        if (rs && rs.length > 0) {
            callback(null, rs[0]);
        }else{
            logger.error('No MT found based on sponsor and salidaid: ' + JSON.stringify(data));
            callback(true);
        }
    });
}

function getPaquete(data, callback){
    var query = util.format('select * from OpratelInfo.dbo.Paquete with(nolock) where AplicacionId = %d and Habilitado = 1', data.aplicacionid);
    mssql.query(query, function(rs) {
        if (rs && rs.length > 0) {
            data.paqueteid = rs[0]['PaqueteId'];
            logger.info('PaqueteId found: ' + data.paqueteid);
        }
        callback(null, data);
    });
}

function requestWas(data, callback) {
    var postRequest = {
        url: data.urlRequest,
        method: "POST",
        headers: {
            'Content-Type': 'text/html'
        },
        body: ''
    }
    logger.debug('Post request: ' + JSON.stringify(postRequest));

    try{
        request(postRequest, function (error, response, body){
            if (!error && response.statusCode == 200){
                // logger.debug(response.body);
                logger.debug('Was response: '  + body);

                if (typeof body != 'undefined') {
                    callback(body.substr(0,2) != 'OK', data);
                } else {
                    callback(true, data);
                }
            } else {
                logger.debug(response);
                callback(true, data);
            }
        });

    }catch(err){
        logger.error('Exception trying to request Was WS: ' + err);
        callback(true, data);
    }
}

module.exports = router;
