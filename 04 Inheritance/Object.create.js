// This is the polyfill for Object.create(). Most browsers already have this
// by default (IE9 has it) so it's very unlikely that you will need it. But this
// may help you understand it a little better.
//
// The second argument in Object.create() allows you to define properties to add
// to the created object. However, you have to fully define the property rather
// than simply giving it a value, for example:
//
//     var source = {};
//     var other = Object.create(source, {
//         foo: {
//             configurable: true,
//             enumerable: true,
//             value: "foo",
//             writable: true
//         }
//     });
//     other.foo; // -> "foo"
//
// This is very powerful and allows you to create hidden or read-only properties
// but it cannot be reproduced in IE8. Therefore, the best thing to do it throw
// an error if someone tries to use it and just refuse to support IE8 in that
// case. The first argument will still work.

if (typeof Object.create !== "function") {

    Object.create = function (base, settings) {

        "use strict";

        var F = function () {
            return;
        };

        if (settings !== undefined) {

            throw new Error(
                "Second argument in Object.create not supported in this browser"
            );

        }

        F.prototype = base;

        return new F();

    };

}
