var express = require('express');
var router = express.Router({mergeParams: true});
var request = require('request');

var logger, opradb, config, mssql, helper, operator;

router.get('/', function(req, res, next) {
    logger = req.app.locals.logger;
    opradb = req.app.locals.opradb;
    mssql = req.app.locals.mssql;
    config = req.app.locals.config;
    helper = req.app.locals.helper;
    if(typeof req.params.oid != 'undefined' && helper.operatorExists(req.params.oid)){
        operator = require(__dirname + '/../config/' + config.operator[req.params.oid]);

        res.sendStatus(200);
        var sms = {
            ID: false,
            from: req.query.from,
            to: req.query.to,
            content: req.query.content,
            nocharge: req.query.nocharge
        };
        sendSMS(sms, operator);
    }else{
        res.status(404).send('404: Page not Found');
    }
})

function sendSMS(sms, operator){
    var headers = { 'Content-Type': 'application/json' }
    var options = {
        url: operator.sender.url,
        method: 'GET',
        headers: headers,
        qs: {
            'sendSms': true,
            'messageType': 'SMS',
            'username': operator.sender.username,
            'password': operator.sender.password,
            'sender': sms.from,
            'recipient': sms.to,
            'message': sms.content
        }
    };

    var mtType = (sms.nocharge == 1) ? 'free' : 'bill';

    if (operator.sponsorId == '48'){
        if (mtType == 'free'){
            options.qs.charge = 0;
        }else{
            options.qs.charge = 10;
        }
    }

    var msg = 'Sending MT From: ' + sms.from + ' | To: ' + sms.to + " | MT Type: " + mtType;
    logger.info(msg);
    //io.emit('container1', '[' + utils.clientNow() + '] ' + msg);
    request(options, function (error, response, body){
        if (!error && response.statusCode == 200){
            try{
                logger.info('Response: ' + body);
            }catch(e){
                logger.error('Exception on response: ' + e.message);
            }
        }else{
            if (error){
                logger.error('There was an error while trying to send the message: ' + error);
            }
        }

    });
}


module.exports = router;
