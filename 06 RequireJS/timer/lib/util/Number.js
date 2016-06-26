define([
    "lib/util/core"
], function (
    core
) {

    "use strict";

    var utilityNumber = {};

    function toNearest(number, nearest, method) {

        if (!method || !Math[method]) {
            method = "round";
        }

        return Math[method](number / nearest) * nearest;

    }

    core.assign(utilityNumber, {
        toNearest: toNearest
    });

    return utilityNumber;

});
