define(function () {

    "use strict";

    var core = {};

    var assign = Object.assign || function (source) {

        var objects = Array.prototype.slice.call(arguments, 1);

        objects.forEach(function (object) {

            Object.keys(object).forEach(function (key) {
                source[key] = object[key];
            });

        });

        return object;

    };

    function addConstants(object, constants) {

        Object.keys(constants).forEach(function (name) {

            Object.defineProperty(object, name, {
                configurable: false,
                enumerable: true,
                value: constants[name],
                writable: false
            });

        });

    }

    assign(core, {
        addConstants: addConstants,
        assign: assign
    });

    return core;

});
