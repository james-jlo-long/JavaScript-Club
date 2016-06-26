define([
    "lib/util/core"
], function (
    core
) {

    "use strict";

    var utilityArray = {};

    var arrayFrom = Array.from || function (array, map, context) {

        if (!map) {

            map = function (x) {
                return x;
            };

        }

        return Array.prototype.map.call(array, map, context);

    };

    core.assign(utilityArray, {
        from: arrayFrom
    });

    return utilityArray;

});
