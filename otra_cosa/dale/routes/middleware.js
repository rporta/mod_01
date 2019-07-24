var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var utils = require('../../libs/utils');

var logger, helper, config, redis;

router.post('/unsubscribe', function(req, res, next) {
    logger = req.app.locals.logger;
    config = req.app.locals.config;
    helper = req.app.locals.helper;
    redis = req.app.locals.redis;
    operator = req.app.locals.operator;

    if(typeof operator.id != 'undefined' && helper.operatorExists(operator.id)){
        if (typeof req.body != 'undefined'
            && typeof req.body.msisdn != 'undefined'
            && typeof req.body.medioId != 'undefined'
            && typeof req.body.paqueteId != 'undefined'
        ) {
            res.status(200).json({ statusCode: 0 });

            var postData = {
                oid: operator.id,
                medioid: req.body.medioId,
                msisdn: req.body.msisdn,
                paqueteid: req.body.paqueteId,
                reproceso: 0
            }
            var uniqid = utils.getSessionId();
            redis.set('u_'  + uniqid, JSON.stringify(postData));
            logger.info('Inserting into Redis: u_' + uniqid + ': ' +  JSON.stringify(postData));

        } else {
            logger.error('Request subscription con datos obligatorios faltantes. Params: ' + JSON.stringify(req.body));
            res.status(200).json({ statusCode: -100 });
        }
    }else{
        res.status(404).send('404: Page not Found');
    }
});

module.exports = router;
