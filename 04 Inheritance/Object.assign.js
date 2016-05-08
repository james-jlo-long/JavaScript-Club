// Modern browsers already have this method; older browsers don't but the
// polyfill is very simple.
//
// Object.assign can take any number of objects and add their properties to a
// source object. Beware that the source object is always modified.

if (typeof Object.assign !== "function") {

    Object.assign = function (source) {

        "use strict";

        Array.prototype.slice.call(arguments, 1).forEach(function (object) {

            Object.keys(object).forEach(function (key) {
                source[key] = object[key];
            });

        });

        return source;

    };

}
