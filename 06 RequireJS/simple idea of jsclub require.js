/*
Step 1: Include a script
 */

function includeScript(url, success, error) {

    var script = document.createElement("script");

    script.src = url;
    script.type = "text/javascript";
    script.async = true;

    if (typeof success === "function") {
        script.onload = success;
    }

    if (typeof error === "function") {
        script.onerror = error;
    }

    document.head.appendChild(script);

}


includeScript("/lib/jQuery.js", function () {
    $; // <-- jQuery
});

/*
Step 2: Cache the results and return promises.
 */

if (!window.Promise) {

    window.Promise = (function () {

        var Prom = function (handler) {

            this.callbacks = [];
            this.handle(handler);

        };

        Prom.prototype = {

            handle: function (handler) {

                if (!this.state) {

                    try {

                        if (typeof handler === "function") {

                            handler(
                                this.complete.bind(this, "fulfilled"),
                                this.complete.bind(this, "rejected");
                            );

                        } else {
                            this.complete("fulfilled", handler);
                        }

                    } catch (ex) {
                        this.complete("rejected");
                    }

                }

            },

            complete: function (state, data) {

                if (!this.state) {

                    this.state = state;
                    this.data = data;

                    this.callbacks.forEach(function (pair) {
                        this.then(pair[0], pair[1]);
                    }, this);

                }

            },

            then: function (onFullfilled, onRejected) {

                switch (this.state) {

                case "fulfilled":

                    if (typeof onFulfilled === "function") {
                        onFulfilled(this.data);
                    }

                    break;

                case "rejected":

                    if (typeof onRejected === "function") {
                        onRejected(this.data);
                    }

                    break;

                default

                    this.callbacks.push([
                        onFulfilled,
                        onRejected
                    ]);

                }

                return this;

            },

            catch: function (onRejected) {
                return this.then(undefined, onRejected);
            }

        };

        Prom.all = function (promises) {

            return new Prom(function (resolve, reject) {

                var count = promises.length;
                var completed = 0;
                var hasExecuted = false;
                var resolvedData = [];

                promises.forEach(function (promise, i) {

                    promise.then(function (data) {

                        completed += 1;
                        resolvedData[i] = data;

                        if (!hasExecuted && completed === count) {

                            hasExecuted = true;
                            resolve(resolvedData);

                        }

                    }, function (reason) {

                        if (!hasExecuted) {

                            hasExecuted = true;
                            reject(reason);

                        }

                    });

                });

            });

        };

        Prom.race = function (promises) {

            return new Prom(function (resolve, reject) {

                var hasExecuted = false;

                promises.forEach(function (promise) {

                    promise.then(function (data) {

                        if (!hasExecuted) {

                            hasExecuted = true;
                            resolve(data);

                        }

                    }, function (reason) {

                        if (!hasExecuted) {

                            hasExecuted = true;
                            reject(reason);

                        }

                    });

                });

            });

        };

        Prom.resolve = function (data) {

            return new Prom(function (resolve) {
                resolve(data);
            });

        };

        Prom.reject = function (reason) {

            return new Prom(function (ignore, reject) {
                reject(reason);
            });

        };

        return Prom;

    }());

}

// good for testing promises
function resolveAfter(time) {

    return new Promise(function (resolve) {

        window.setTimeout(function () {
            console.log("resolved after %d ms", time);
            resolve(time);
        }, time);

    });

}
Promise.race([resolveAfter(500), resolveAfter(1000), resolveAfter(2000), Promise.resolve("auto resolve")]).then(console.info.bind(console), console.error.bind(console));
Promise.all([ resolveAfter(500), resolveAfter(1000), resolveAfter(2000), Promise.resolve("auto resolve")]).then(console.info.bind(console), console.error.bind(console));


var cache = {};

function getScript(url) {

    if (!cache[url]) {

        cache[url] = new Promise(function (resolve, reject) {
            includeScript(url, resolve, reject);
        });

    }

    return cache[url];

}

getScript("/lib/jQuery.js").then(function () {
    $; // <-- jQuery
});

getScript("/lib/jQuery.js").then(function () {
    $; // <-- jQuery, but from cache
});

/*
Step 3: Allow the ability to get multiple scripts at once.
 */

function getScript(url) {

    var prom;

    if (Array.isArray(url)) {
        prom = Promise.all(url.map(getScript));
    } else {

        prom = cache[url];

        if (!prom) {

            prom = new Promise(function (resolve, reject) {
                includeScript(url, resolve, reject);
            });
            cache[url] = prom;

        }

    }

    return prom;

}

getScript("/lib/jQuery.js").then(function () {
    $; // <-- jQuery
});

getScript(["/lib/jQuery.js", "/lib/underscore.js"]).then(function () {
    $; // <-- jQuery
    _; // <-- Underscore
});

/*
Define modules
Currently untied to Promises
 */

(function (namespace) {

    "use strict";

    var modules = {};

    function getModule(name) {

        return Object.prototype.hasOwnProperty.call(modules, name)
            ? modules[name]
            : undefined;

    }

    /**
     *  require(names, callback) -> ?
     *  - names (String|Array): Name(s) of the module(s) to get.
     *  - callback (Function): Function to execute once all modules are found.
     *
     *  Accesses modules and passes them all to the given `callback`. Modules
     *  become the `callback` arguments in the order they were requested.
     *
     *      require(["one", "two"], function (one, two) {
     *          // one = Module "one"
     *          // two = Module "two"
     *      });
     *
     *  For including a single module, a string can be passed instead of an
     *  array.
     *
     *      require("one", function (one) {
     *          // one = Module "one"
     *      });
     *
     *  Modules that aren't found are still included in the arguments, but they
     *  reference `undefined`.
     *
     *      require(["one", "NOT-REAL", "two"], function (one, _, two) {
     *          // one = Module "one"
     *          // _ = undefined
     *          // two = Module "two"
     *      });
     *
     *  To create a module, use [[define]].
     **/
    function require(names, callback) {

        var requests = Array.isArray(names)
            ? names
            : [names];

        //return callback(...requests.map(getModule));
        return callback.apply(undefined, requests.map(getModule));

    };

    /**
     *  define(name[, requires], factory)
     *  - name (String): Name of the module to define.
     *  - requires (String|Array): Required dependancy(ies).
     *  - factory (Function): Function to create the module.
     *
     *  Defines a module. The `factory` method is executed, passing in any
     *  `requires` (if they were provided) and creates the module. Be warned
     *  that `factory` is executed as soon as the module is defined.
     *
     *      define("foo", function () {
     *          return {
     *              foo: true
     *          };
     *      });
     *
     *  With the example above, a "foo" module is defined, an object with the
     *  property `"foo"` set to `true`. This can now be accessed by any other
     *  module.
     *
     *  If a value is passed to the `requires` argument, it is treated in the
     *  same way as [[require]]:
     *
     *      define("bar", ["foo"], function (foo) {
     *          return {
     *              bar: true && foo.foo
     *          };
     *      });
     *
     *  The `factory` argument has to be a function, but it can return anything
     *  (including nothing at all).
     **/
    function define(name, requires, factory) {

        if (typeof requires === "function") {

            factory  = requires;
            requires = [];

        }

        modules[name] = require(requires, factory);

    };

    Object.assign(namespace, {
        require: require,
        define: define
    });

}(window));


/*
Integrate promises
 */

var modules = {};
var promises = {};

function define(name, requires, factory) {
    modules[name] = require(requires, factory);
}

function getModule(url, callback) {

    if (!promises[url]) {

        promises[url] = new Promise(function (resolve, reject) {

            getScript(url).then(function () {
                resolve(modules[url]);
            });

        });

    }

    if (typeof callback === "function") {
        promises[url].then(callback);
    }

    return promises[url];

}

getModule("/lib/jQuery.js", function ($) {
    $; // <-- jQuery
});

function getModule(url, callback) {

    var promise;

    if (Array.isArray(url)) {

        promise = Promise.all(url.map(u => getModule(u)));

    } else {

        promise = promises[url];

        if (!promise) {
            // ...
        }

    }

    if (typeof callback === "function") {
        promise.then(callback);
    }

    return promise;

}

getModule(["/lib/jQuery.js", "/lib/underscore.js"], function ($, _) {
    $; // <-- jQuery
    _; // <-- Underscore
});
