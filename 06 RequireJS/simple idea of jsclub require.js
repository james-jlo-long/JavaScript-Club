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

            complete: function (reason, data) {

                if (!this.state) {

                    this.state = reason;
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

getScript(["/lib/jQuery.js", "/lib/jQuery.ui.js"]).then(function () {
    $;    // <-- jQuery
    $.ui; // <-- jQuery UI
});
