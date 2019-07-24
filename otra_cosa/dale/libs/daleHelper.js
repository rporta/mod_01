var basicAuth = require('basic-auth');
var sha1 = require('sha1');
var nodemailer = require('nodemailer');

daleHelper = {
	connected: false,
	setLogger: function(logger){ this.logger = logger },
	setConfig: function(config){ this.config = config },
	operatorExists: function (op){
    	return (typeof this.config.operator[op] != 'undefined') ? true : false;
	},
	sendMail: function(subject, body, recipients) {
		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://alertas%40opratel.com:alertas2013@smtp.gmail.com');

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: 'alertas@opratel.com', // sender address
		    to: recipients, // list of receivers
		    subject: subject, // Subject line
		    text: body // plaintext body
		};
		var thisb = this;

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if (error) {
		        thisb.logger.error(error);
		    } else {
		    	thisb.logger.debug('Message sent: ' + info.response);
		    }
		});

	}

}

module.exports = daleHelper;
