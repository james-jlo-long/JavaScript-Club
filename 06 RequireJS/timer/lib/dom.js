define([
    "lib/util"
], function (
    util
) {

    "use strict";

    var dom = {};

    function get(selector, context) {

        return util.Array.from(
            (context || document).querySelectorAll(selector)
        );

    }

    function byQuery(selector, context) {
        return (context || document).querySelector(selector);
    }

    // Remember that handler.bind() will change handler. There can't be an `off`
    // that would work as a result of this. I'd fix it, but I'm feeling lazy and
    // this is just a demo anyway -- JLo.
    function on(element, event, handler, context) {
        element.addEventListener(event, handler.bind(context || element));
    }

    function onByQuery(selector, event, handler, context) {

        get(selector).forEach(function (element) {
            on(element, event, handler, context);
        });

    }

    util.Object.assign(dom, {
        get: get,
        byQuery: byQuery,
        on: on,
        onByQuery: onByQuery
    });

    return dom;

});
