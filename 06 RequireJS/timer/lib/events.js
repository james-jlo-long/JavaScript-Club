define([
    "lib/util"
], function (
    util
) {

    "use strict";

    var events = {};
    var dummy = document.createElement("div");

    function trigger(name, detail) {

        dummy.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail: detail
        }));

    }

    function listen(name, handler, context) {
        dummy.addEventListener(name, handler.bind(context), false);
    }

    util.Object.assign(events, {
        trigger: trigger,
        listen: listen
    });

    return events;

});
