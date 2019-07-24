var winston = require('winston');
var mssql = require('../libs/mssql');
var utils = require('../libs/utils');
var util = require('util');
var opradb = require('../libs/opradb');
// var async = require('async');
var heartbeats = require('../libs/heartbeats');
var request = require('request');

var config = require('./config/config');
var operatorName = 'auy';

if (typeof config.operator[operatorName] == 'undefined'){
    console.log('Operador invalido');
    process.exit();
} else{
    var operator = require(__dirname + '/config/' + config.operator[operatorName]);
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ timestamp: function() { return utils.now(); }, level: 'debug'}),
        new (winston.transports.File)({ timestamp: function() { return utils.now(); }, filename: 'logs/'+ operatorName +'_access.log', json: false })
    ]
});
var mssqlLogger = new (winston.Logger)({
    transports: [ new (winston.transports.File)({ timestamp: function() { return utils.now(); }, filename: 'logs/'+ operatorName +'_mssql_access.log', json: false })]
});

// process.exit();

/*** Start ***/
mssql.setConfig(config.mssql);
mssql.setLogger(mssqlLogger);
mssql.init(function(connected){
    if (connected){ getMessages(); }
});

heartbeats.setLogger(mssqlLogger);
heartbeats.setDB(mssql);
heartbeats.init(operator.bgwServiceName, operator.heartBeatInterval);

opradb.setOperator(operator);
opradb.setDB(mssql);
opradb.setLogger(logger);

setInterval(getMessages, (operator.programInterval * 1000));

function getMessages() {
    logger.debug('Iniciando');
    if (mssql.connected) {
        logger.debug('Obteniendo nuevos mensajes para procesar');
        // todo: agregar medioid al SP!
        mssql.execute(operator.db.getMT, { SponsorId: 20, Top: 5, EstadoEsId: 1 }, function(rs) {
            for(var i in rs[0]) {
                var sms = {
                    salidaid: rs[0][i].SalidaId,
                    msisdn: rs[0][i].Destino,
                    aplicacionid: rs[0][i].AplicacionId,
                    suscripcionid: rs[0][i].SuscripcionId,
                    contenido: rs[0][i].Contenido,
                    medioid: rs[0][i].MedioId,
                    shortcode: rs[0][i].Origen,
                    prioridad: rs[0][i].Prioridad,
                    entradaid: rs[0][i].EntradaId,
                    mds: rs[0][i].Relacion,
                    freemedioid: rs[0][i].FreeMedioId,
                    freemedio: rs[0][i].FreeMedio
                }
                procesar(sms);
            }
        });
    }
}

function procesar(sms)
{
    logger.debug('Procesando SMS: ' + JSON.stringify(sms));
    logger.info('Processing SalidaId: ' + sms.salidaid);
    getDaleRecord(sms, function(err, daleRecord) {
        if (err) {
            logger.error('Invalid process of SMS Record ' + JSON.stringify(sms))
        } else {

            var args;
            var errorConnect = null;

            if (sms.msisdn.substr(0,3) == '598') {
                sms.msisdn = '0' + sms.msisdn.substr(3);
            }


            var postData = {
                // {
                  movil: sms.msisdn,
                  portal: daleRecord.PortalId,
                  servicio: daleRecord.ServiceId,
                  transaccion: sms.salidaid
                // }
            }
            // url: "http://hera:8079/mock/{subscriptionId}/validate_token".replace("{subscriptionId}",req.body.subscriptionId),
	    var billUrl = operator.url.bill;
	    /*if (sms.aplicacionid == 1156){
			var billUrl = operator.url.bill;
	    }else{
			var billUrl = operator.url.billTest;
	    }*/

            var postRequest = {
                url: billUrl,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }
            logger.debug('Post request: ' + JSON.stringify(postRequest));

            try{
                request(postRequest, function (error, response, body){
                    if (!error && response.statusCode == 200){
                        logger.debug(response.body);
                        body = JSON.parse(body);
                        logger.debug(body);

                        if (typeof body.cobroExitoso != 'undefined') {
                            // se supone que este cobroExitoso significa cobro aceptado para ser procesado. si falla, actualizamos mt
                            var cobroExitoso = (body.cobroExitoso) ? 'PENDING' : 'FAILED';
                            logger.info('SalidaId: ' + sms.salidaid + ' | ' + cobroExitoso);
                            if (!body.cobroExitoso) {
                            }
                        } else {
                            // ver si aca reprocesamos
                            logger.debug('Code -1');
                        }
                    } else {
                        if (typeof response != 'undefined' && typeof response.statusCode != 'undefined') {
                            logger.error('Error response: statusCode: ' + response.statusCode);
                        } else {
                            logger.error('Error: NO response');
                        }
                        sms.estadoesid = 19;
                        if (typeof response != 'undefined' && typeof response.body != 'undefined') {
                            logger.error('Body: ' + response.body);
                            if (response.body == 'El movil ' + sms.msisdn + ' no está suscripto al servicio ' + daleRecord.ServiceId + ' del portal '+ daleRecord.PortalId +'.') {
                                sms.estadoesid = 17;
                            }
                        } else {
                            logger.error(response);
                        }
                        opradb.updateMT(sms, function(err, data){
                            if (err) {
                                logger.error('Error update Salida ' + JSON.stringify(data));
                            }
                        });
                    }
                });

            }catch(err){
                logger.error('Exception trying to charge MT: ' + err);
            }

        }
    });

}

function getDaleRecord(data, callback){
    logger.debug('Getting dalemap...');
    // var query = util.format('select * from OpratelCenter.dbo.DaleMap dm with(nolock) inner join OpratelCenter.dbo.Salida s with(nolock) \
    //                         on dm.SponsorId = s.SponsorId AND dm.AplicacionId = s.SalidaId AND dm.MedioId = s.MedioId \
    //                         where s.SalidaId = %d AND dm.SponsorId = %d and dm.AplicacionId = %d AND dm.MedioId = %d AND dm.enabled = 1', data.salidaid, data.sponsorid, data.aplicacionid, data.medioid);
    var query = util.format('select * from OpratelCenter.dbo.DaleMap dm with(nolock) \
                            where dm.SponsorId = %d and dm.AplicacionId = %d AND dm.MedioId = %d AND dm.enabled = 1', operator.sponsorId, data.aplicacionid, data.medioid);
    // console.log(query);
    mssql.query(query, function(rs) {
        if (rs && rs.length > 0) {
            callback(null, rs[0]);
        }else{
            logger.error('No DaleMap found based on sponsor, aplicacionid & medioid: ' + JSON.stringify(data));
            callback(true);
        }
    });
}



// function sendHeartBeat(){
//     mssql.execute('sp_heartbeats', { Service: 'MW Movistar Chile' });
// }
