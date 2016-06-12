define("require-util.js", function () {

    return {

        forEach: Array.forEach || function (array, handler, context) {
            return Array.prototype.forEach.call(array, handler, context);
        }

    };

});
