var async = require('async');
var express = require('express');
var router = express.Router();

var operator, logger, opradb, redis, helper;

router.all('/', function(req, res, next) {
	operator = req.app.locals.operator;
	logger = req.app.locals.logger;
	opradb = req.app.locals.opradb;
	redis = req.app.locals.redis;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;

	var params;

    if (typeof req.body.celular != "undefined") {
		params = req.body;
	} else {
		params = req.query;
	}

	if (typeof params.celular != "undefined" && typeof params.fecha  != "undefined" &&  typeof params.codError  != "undefined") {

		logger.info('CONFIRM | Fecha: ' + params.fecha + ' | Celular: ' + params.celular + ' | Cod. Error: ' + params.codError);

		res.status(200).send('OK');
		res.end();
	} else {

		logger.error('CONFIRM | params no reconocido ' + JSON.stringify(params));

		res.status(400).send('ERROR');
		res.end();
	}
});

module.exports = router;
