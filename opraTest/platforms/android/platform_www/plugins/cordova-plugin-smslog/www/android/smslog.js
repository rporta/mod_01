cordova.define("cordova-plugin-smslog.SmsLogAndroid", function(require, exports, module) {
module.exports = {
	hasReadPermission: function(successCallback, errorCallback) {
		cordova.exec(successCallback, errorCallback, 'SmsLog', 'hasReadPermission', []);
	},
	requestReadPermission: function(successCallback, errorCallback) {
		cordova.exec(successCallback, errorCallback, 'SmsLog', 'requestReadPermission', []);
	}
};
});
