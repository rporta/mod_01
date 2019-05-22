cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.darktalker.cordova.screenshot.screenshot",
      "file": "plugins/com.darktalker.cordova.screenshot/www/Screenshot.js",
      "pluginId": "com.darktalker.cordova.screenshot",
      "merges": [
        "navigator.screenshot"
      ]
    },
    {
      "id": "cordova-plugin-android-wifi-manager.WifiManager",
      "file": "plugins/cordova-plugin-android-wifi-manager/www/index.js",
      "pluginId": "cordova-plugin-android-wifi-manager",
      "clobbers": [
        "cordova.plugins.WifiManager"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-background-mode.BackgroundMode",
      "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
      "pluginId": "cordova-plugin-background-mode",
      "clobbers": [
        "cordova.plugins.backgroundMode",
        "plugin.backgroundMode"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open",
        "window.open"
      ]
    },
    {
      "id": "cordova-plugin-smslog.SmsLog",
      "file": "plugins/cordova-plugin-smslog/www/smslog.js",
      "pluginId": "cordova-plugin-smslog",
      "merges": [
        "window.plugins.smsLog"
      ]
    },
    {
      "id": "cordova-plugin-smslog.SmsLogAndroid",
      "file": "plugins/cordova-plugin-smslog/www/android/smslog.js",
      "pluginId": "cordova-plugin-smslog",
      "merges": [
        "window.plugins.smsLog"
      ]
    },
    {
      "id": "cz.blocshop.socketsforcordova.Socket",
      "file": "plugins/cz.blocshop.socketsforcordova/socket.js",
      "pluginId": "cz.blocshop.socketsforcordova",
      "clobbers": [
        "window.Socket"
      ]
    },
    {
      "id": "fr._46cl.focus.focus",
      "file": "plugins/fr._46cl.focus/www/focus.js",
      "pluginId": "fr._46cl.focus",
      "clobbers": [
        "cordova.plugins.Focus"
      ]
    }
  ];
  module.exports.metadata = {
    "com.darktalker.cordova.screenshot": "0.1.6",
    "cordova-plugin-android-wifi-manager": "1.0.0",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-background-mode": "0.7.2",
    "cordova-plugin-inappbrowser": "3.0.0",
    "cordova-plugin-smslog": "1.0.0",
    "cordova-plugin-whitelist": "1.3.3",
    "cz.blocshop.socketsforcordova": "1.1.0",
    "fr._46cl.focus": "0.1.3"
  };
});