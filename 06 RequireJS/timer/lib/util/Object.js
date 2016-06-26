define([
    "lib/util/core"
], function (
    core
) {

    "use strict";

    var utilityObject = {};

    core.assign(utilityObject, {
        addConstants: core.addConstants,
        assign: core.assign
    });

    return utilityObject;

});
