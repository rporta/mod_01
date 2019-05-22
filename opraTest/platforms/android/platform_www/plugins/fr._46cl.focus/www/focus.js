cordova.define("fr._46cl.focus.focus", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
utils = require('cordova/utils'),
exec = require('cordova/exec');

var Focus = function() {
};

Focus.focus = function(element, dbug) {

    bodyRect = document.body.getBoundingClientRect(),
    rect = {
        top: 0,
        left: 0,
        right: element.x ,
        bottom: element.y
    };

    var coordenadas = new Object();
    coordenadas.x = element.x;
    coordenadas.y = element.y;        
    dbug.setText(coordenadas);
    exec(null, null, "Focus", "focus", [rect]);
};

module.exports = Focus;




});
