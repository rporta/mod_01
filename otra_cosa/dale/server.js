var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var ipfilter = require('express-ipfilter');
var request = require('request');
var winston = require('winston');
var utils = require('../libs/utils');
var mssql = require('../libs/mssql');
var helper = require('./libs/daleHelper');
var redis = require('./libs/redis');
var async = require('async');
var querystring = require('querystring');

var config = require('./config/config');
var medios = require('/var/resources/medios');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            timestamp: function() {
                return utils.now();
            },
            colorize: true,
            level: 'debug'
        }),
        new(winston.transports.File)({
            timestamp: function() {
                return utils.now();
            },
            filename: 'logs/server_access.log',
            json: false
        })
    ]
});
var mssqlLogger = new(winston.Logger)({
    transports: [
        //new (winston.transports.Console)({ timestamp: function() { return utils.now(); }, colorize: true, level: 'debug'}),
        new(winston.transports.File)({
            timestamp: function() {
                return utils.now();
            },
            filename: 'logs/server_mssql_access.log',
            json: false
        })
    ]
});

var redisLogger = new(winston.Logger)({
    transports: [
        // new (winston.transports.Console)({ timestamp: function() { return utils.now(); }, colorize: true, level: 'debug'}),
        new(winston.transports.File)({
            timestamp: function() {
                return utils.now();
            },
            filename: 'logs/server_redis_access.log',
            json: false
        })
    ]
});

mssql.setConfig(config.mssql);
mssql.setLogger(mssqlLogger);
mssql.init();

redis.setConfig(config);
redis.setLogger(redisLogger);
redis.init();
var args = process.argv.slice(2);
var operatorName = (typeof args[0] != 'undefined') ? args[0] : false;
if (!operatorName) {
    console.log('Debe especificar operador');
    process.exit();
}

if (typeof config.operator[operatorName] == 'undefined') {
    console.log('Operador invalido');
    process.exit();
} else {
    var operator = require(__dirname + '/config/' + config.operator[operatorName]);
}


var opradb = require('../libs/opradb');
opradb.setOperator(operator);
opradb.setDB(mssql);
opradb.setRedis(redis);
opradb.setLogger(logger);

helper.setConfig(config);
helper.setLogger(logger);

var heartbeats = require('../libs/heartbeats');
heartbeats.setLogger(mssqlLogger);
heartbeats.setDB(mssql);
heartbeats.init(operator.serviceName);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//IPs permititas!
app.use(ipfilter(config.server.whitelist, {
    mode: 'allow'
}));
http.listen(operator.port, function() {
    logger.info('Web Service started on port ' + operator.port);
});

app.locals.logger = logger;
app.locals.opradb = opradb;
app.locals.mssql = mssql;
app.locals.config = config;
app.locals.helper = helper;
app.locals.redis = redis;
app.locals.operator = operator;

var notification = require('./routes/notification');
app.use('/:oid/notification', notification);

var sms = require('./routes/sms');
app.use('/:oid/sms', sms);

var confirm = require('./routes/confirm');
app.use('/:oid/confirm', confirm);

var middleware = require('./routes/middleware');
app.use('/:oid/mw', middleware);

//RAMIRO PORTAS //http://api-dale.sva.antel.com.uy/swagger-ui.html#!/Suscripciones/cancelarSuscripcionUsingPOST
var unsubscribe = require('./routes/unsubscribe');
app.use('/:oid/unsubscribe', unsubscribe);

processUnsubscription = (redisString, cb) => {
    var redisObj = JSON.parse(redisString);
    var operator = require(__dirname + '/config/' + config.operator[redisObj.oid]);
    var daleConfig = require('/var/resources/dale.json');
    var daleRecord = daleConfig.daleMap[operator.sponsorId.toString()][redisObj.medioid.toString()][redisObj.paqueteid.toString()];
    if (operator && typeof daleRecord != 'undefined' && typeof daleRecord.ServiceId != 'undefined' && daleRecord.PortalId != 'undefined') {
        var postData = {
            movil: redisObj.msisdn,
            portal: daleRecord.PortalId,
            servicio: daleRecord.ServiceId
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

        try {
            request(postRequest, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    logger.debug(response.body);
                    body = JSON.parse(body);
                    // logger.debug(body);
                    if (typeof body.status == 'undefined' || body.status == 'false') {
                        if (body.status == 'false' && typeof body.error != 'undefined') {
                            logger.error('Unsubscription | API failure: ' + body.error + ' | Request: ' + JSON.stringify(postData));
                        } else {
                            logger.error('Unsubscription | API failure | Request: ' + JSON.stringify(postData));
                        }
                        redisReinsert('u', redisObj);
                        cb(false);
                    } else {
                        logger.info('Unsubscription | API success | Msisdn: ' + redisObj.msisdn);
                        cb(true);
                    }

                } else {
                    logger.error('Unsubscription | API failure | Request: ' + JSON.stringify(postData) + ' | Response: ' + response.body);
                    redisReinsert('u', redisObj);
                    cb(false);
                }
            });

        } catch (err) {
            logger.error('Unsubscription | Exception trying to send unsubscription request: ' + err + '. Request: ' + JSON.stringify(postData));
            redisReinsert('u', redisObj);
            cb(false);
        }
    }
}

fireRedisQueue = (tipo) => {
    logger.debug('Starting process fireRedisQueue ' + tipo);
    try {
        var match = tipo + '_*';
        var count = config.redis.readCount;
        redis.keys(match, function(err, keys) {
            if (err) {
                logger.error(JSON.stringify(err));
            } else {
                var countRequests = keys.length;
                if (countRequests) {
                    count = (count > countRequests) ? countRequests : count;
                    var data = [];
                    async.waterfall([
                            function(cb) {
                                async.eachLimit(keys, count, function(value, callbackEach) {
                                    redis.get(value, function(rs) {
                                        logger.debug('Redis ' + tipo + ' record: ' + rs);
                                        if (rs) {
                                            data.push(rs);
                                            redis.del(value);
                                            callbackEach();
                                        } else {
                                            callbackEach();
                                        }
                                    });
                                }, function(err) {
                                    cb(null, data);
                                });

                            },
                            function(data, cb) {
                                async.eachSeries(data, function(value, callbackEach) {
                                    processUnsubscription(value, function(error) {
                                        callbackEach();
                                    });

                                }, function(err) {
                                    if (err) {
                                        logger.error(err.message);
                                    }

                                });
                            }
                        ],
                        function(err, rs) {
                            logger.debug('Proceso finalizado');

                        });
                } else {
                    logger.debug('fireRedisQueue: No keys to process');
                }
            }
        });



    } catch (err) {
        logger.error('Error fireRedisQueue: ' + err);
    }
}

mapCode = (operator, paqueteid) => (typeof operator.codeMap[paqueteid] != 'undefined') ? operator.codeMap[paqueteid] : null;

redisReinsert = (tipo, obj) => {
    var action = 'Unsubscription';
    var operator = require(__dirname + '/config/' + config.operator[obj.oid]);
    if (obj.reproceso < operator.maxApiQueueReprocess) {
        obj.reproceso = obj.reproceso + 1;
        var uniqid = tipo + 'r_' + utils.getSessionId();
        redis.set(uniqid, JSON.stringify(obj));
        logger.error('API request failed. Reinserting into Redis: ' + uniqid + ': ' + JSON.stringify(obj));
    } else {
        logger.error('API request failed. | Reprocess limit reached: ' + JSON.stringify(obj));
        helper.sendMail(
            'Dale ' + action + ' middleware. Límite de reprocesos alcanzados.',
            'Se alcanzó el nro. máximo de reintentos: ' + operator.maxApiQueueReprocess + ' para el registro ' + JSON.stringify(obj),
            operator.apiQueueFailureEmailRecipients
        )

    }

}

setInterval(function() {
    fireRedisQueue('u');
}, config.redis.readInterval);
setInterval(function() {
    fireRedisQueue('ur');
}, config.redis.readReprocessInterval);