cordova.define("cordova-plugin-smslog.SmsLog", function(require, exports, module) {
module.exports = {
  getSmsLog: function(filters, withBody, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "SmsLog", "getSmsLog", [filters, withBody]);
  }
};
  
});
