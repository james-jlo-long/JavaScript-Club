define([
    "lib/util/core"
], function (
    core
) {

    "use strict";

    var utilityString = {};

    const PAD_LEFT = "left";
    const PAD_RIGHT = "right";
    const PAD_BOTH = "both";

    var interpret = function (string) {

        return (string === null || string === undefined)
            ? ""
            : String(string);

    };

    var repeat = typeof String.prototype.repeat === "function"
        ? function (string, times) {
            return interpret(string).repeat(times);
        }
        : function (string, times) {
            return Array(times + 1).join(interpret(string));
        }

    function pad(string, length, padding, direction) {

        var str = String(string);
        var len = Math.max(str.length, Math.round(length) || 0);
        var left = "";
        var right = "";
        var pad = padding
            ? String(padding)
            : " ";
        var amount = 0;
        var padded = str;

        if (str.length < len) {

            if (direction === PAD_LEFT) {

                left = repeat(pad, length).slice(0, len - str.length);
                padded = left + str;

            } else if (direction === PAD_BOTH) {

                amount = Math.ceil((len - str.length) / 2);
                left = repeat(pad, length).slice(0, amount);
                right = repeat(pad, length).slice(0, str.length + amount);
                padded = left + str + right;

            } else {

                right = repeat(pad, length).slice(0, len - str.length);
                padded = str + right;

            }

        }

        return padded;

    }

    core.assign(utilityString, {
        interpret: interpret,
        repeat: repeat,
        pad: pad
    });

    core.addConstants(utilityString, {
        PAD_LEFT: PAD_LEFT,
        PAD_RIGHT: PAD_RIGHT,
        PAD_BOTH: PAD_BOTH
    });

    return utilityString;

});
