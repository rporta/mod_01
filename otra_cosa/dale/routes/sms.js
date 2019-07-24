var async = require('async');
var express = require('express');
var router = express.Router();

var operator, logger, opradb, redis, helper;

router.all('/mo', function(req, res, next) {
    operator = req.app.locals.operator;
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    redis = req.app.locals.redis;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;

    var params;

    if (typeof req.body.origen != "undefined") {
        params = req.body;
    } else {
        params = req.query;
    }

    if (typeof params.origen != "undefined" && typeof params.destino != "undefined" && typeof params.mensaje != "undefined" && typeof params.nroTramite != "undefined") {

        if (params.origen.substr(0, 1) == '0') {
            params.origen = '598' + params.origen.substr(1);
        }
        logger.debug('inserto MO');
        sms(params);

        res.status(200).send('OK');
        res.end();
    } else {

        logger.error('params no reconocido ' + JSON.stringify(params));

        res.status(400).send('ERROR');
        res.end();
    }
});

function sms(data) {
    logger.debug('Raw MO Request: ' + JSON.stringify(data));
    var MO = {
        keyword: data.mensaje,
        msisdn: data.origen,
        shortcode: data.destino
    };
    opradb.insertMO(MO, {
        requireResponse: true
    }, function(err, data) {
        if (!err) {
            logger.debug('SMS - Insert MO OK.');
        } else {
            logger.error('SMS - Error on insert MO: ' + err);
        }
    });
}

module.exports = router;