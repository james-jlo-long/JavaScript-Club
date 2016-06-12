define("require-test.js", ["require-util.js"], function (util) {

    return {

        run: function () {

            util.forEach([1, 2, 3], function (n) {
                console.log(n);
            });

        }

    };

});
