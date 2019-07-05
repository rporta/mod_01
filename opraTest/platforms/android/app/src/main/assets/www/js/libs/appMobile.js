var appMobile = {
	"background": {
		enable: function() {
			cordova.plugins.backgroundMode.enable();
		},
		disable: function() {
			cordova.plugins.backgroundMode.disable();
		},
		moveToBackground: function() {
			cordova.plugins.backgroundMode.moveToBackground();
		},
		moveToForeground: function() {
			cordova.plugins.backgroundMode.moveToForeground();
		},
	},
	"sms": {
		hasReadPermission: function(cbRs, cbErr) {
			window.plugins.smsLog.hasReadPermission(cbRs, cbErr);
		},
		requestReadPermission: function(cbRs, cbErr) {
			window.plugins.smsLog.requestReadPermission(cbRs, cbErr);
		},
		getSmsLog: function(filters, withBody, cbRs, cbErr) {
			window.plugins.smsLog.getSmsLog(filters, withBody, cbRs, cbErr);
		},
	},
	"screenshot": {
		save: function(cb, format, quality, filename) {
			navigator.screenshot.save(cb, format, quality, filename);
		},
		URI: function(cb, quality) {
			navigator.screenshot.URI(cb, quality);
		},
	},
	"socket": {
		newSocket: function(host, port) {
			return io("http://" + host + ":" + port);
		},
		newSocketCordova: function(host, port) {
			var s = new Socket();
			s.open(
				host,
				port,
				function() {
					return s;
				},
				function(errorMessage) {
					return false;
				});
		}
	},
	"wifi": {
		init: function() {
			var WifiManager = cordova.plugins.WifiManager;
			WifiManager.onwifistatechanged = function(data) {
				setTimeout(function() {
					// h.setText("wifi : statechanged");
					// footer.setColorText(vueApp.colorText.yellow[5]);
					setTimeout(function() {
						if (data.wifiState === "ENABLED") {
							// footer.setColorText(vueApp.colorText.green[5]);
							// h.setText("wifi : enabled");
						} else if (data.wifiState === "DISABLED") {
							// footer.setColorText(vueApp.colorText.red[5]);
							// h.setText("wifi : disabled");
						}
					}, rootConfig.interval);
				}, rootConfig.interval);
			};

			return WifiManager;
		}
	}
};