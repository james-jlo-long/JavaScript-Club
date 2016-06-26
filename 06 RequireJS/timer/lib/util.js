define([
    "lib/util/Array",
    "lib/util/Number",
    "lib/util/Object",
    "lib/util/String"
], function (
    Array,
    Number,
    Object,
    String
) {

    "use strict";

    // This isn't exclusive. In a real website, this would probably have
    // namespaces for Function and possibly RegExp as well -- JLo.
    return {
        Array: Array,
        Number: Number,
        Object: Object,
        String: String
    };

});
