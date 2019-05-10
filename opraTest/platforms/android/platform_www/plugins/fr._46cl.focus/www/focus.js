cordova.define("fr._46cl.focus.focus", function(require, exports, module) {
    var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

    var Focus = function() {
    };

    Focus.focus = function(element, dbug, touch) {
        var bodyX, bodyY;
        bodyX = document.body.getBoundingClientRect().right - 20;
        bodyY = document.body.getBoundingClientRect().bottom - 20;
        element.x = bodyX >= element.x ? element.x : bodyX;
        element.y = bodyY >= element.y ? element.y : bodyY;

        var rect = {
            top: 0,
            left: 0,
            right: element.x,
            bottom: element.y
        };

        var coordenadas = new Object();
        coordenadas.x = element.x;
        coordenadas.y = element.y;        
        dbug.setText(coordenadas);
        $(touch.$el).css("top", coordenadas.y);
        $(touch.$el).css("left", coordenadas.x);
        touch.setShow(1);

        setTimeout(function() {
            touch.setShow(0);
            setTimeout(function() {
                exec(null, null, "Focus", "focus", [rect]);
                setTimeout(function() {
                    touch.setShow(1);
                }, 500);
            }, 1000);
        }, 1000);

    };

    module.exports = Focus;

});
