/**
 *  Promise
 *
 *  An **incomplete** polyfill for a
 *  [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 *  to explain how promises work.
 **/
var Promise = window.Promise || (function () {

    "use strict";

    /**
     *  new Promise(handler)
     *  - handler (Function): Handler for resolving/rejecting promise.
     *
     *  Creates a new [[Promise]]. Optionally a `handler` can be provided to
     *  helper resolve or reject the promise. The `handler` function is used to
     *  resolve or reject the promise.
     *
     *      var prom1 = new Promise(function (resolve, reject) {
     *          resolve(1);
     *      });
     *      prom1.then(function (data) {
     *          console.log(data);
     *      });
     *      // logs 1 because Promise is now resolved.
     *
     *      var prom2 = new Promise(function (resolve, reject) {
     *          reject(2);
     *      });
     *      prom2.then(function (data) {
     *          console.log(data);
     *      }, function (data) {
     *          console.log(data * -1);
     *      });
     *      // logs -2 because Promise is now rejected.
     *
     *  **A native `Promise` handles the `handler` much better.**
     **/
    var Prom = function (handler) {

        /**
         *  Promise#callbacks -> Array
         *
         *  The callbacks that have be registered before the promise has been
         *  resolved or rejected.
         *
         *  **This property is not part of the native `Promise`.**
         **/
        this.callbacks = [];

        try {

            handler(
                this.complete.bind(this, "fulfilled"),
                this.complete.bind(this, "rejected")
            );

        } catch (ex) {
            this.complete("rejected", "Error: " + ex.message);
        }

    };

    Prom.prototype = {

        /**
         *  Promise#complete(state[, data])
         *  - state (String): New state of the promise.
         *  - data (?): Optional data for the promise.
         *
         *  Completes the promise. [[Promise#state]] is set to the given `state`
         *  and [[Promise#data]] is set to `data`.
         *
         *  **This method is not part of the native `Promise`.**
         **/
        complete: function (state, data) {

            if (!this.state) {

                /**
                 *  Promise#state -> String
                 *
                 *  The current state of the promise. This is `undefined` while
                 *  the promise is pending.
                 *
                 *  **This property is not part of a native `Promise`.**
                 **/
                this.state = state;

                /**
                 *  Promise#data -> ?
                 *
                 *  The data that will be passed to the callbacks. This is
                 *  `undefined` while the promise is pending.
                 *
                 *  **This property is not part of a native `Promise`.**
                 **/
                this.data = data;

                this.callbacks.forEach(function (pair) {
                    this.then(pair[0], pair[1]);
                }, this);

            }

        },

        /**
         *  Promise#then([onFulfilled[, onRejected]]) -> Promise
         *  - onFulfilled (Function): Optional function to execute when the
         *    promise is resolved.
         *  - onRejected (Function): Optional function to execute when the
         *    promise is rejected.
         *
         *  The main core of the promise. This method allows the user to define
         *  functions to execute when the promise is resolved or rejected. The
         *  `onFulfilled` function will only execute when the promise is
         *  resolved and `onRejected` is only executed when the promise is
         *  rejected. The [[Promise]] instance is returned to allow for
         *  chaining.
         **/
        then: function (onFulfilled, onRejected) {

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

            default:

                this.callbacks.push([
                    onFulfilled,
                    onRejected
                ]);

            }

            return this;

        },

        /**
         *  Promise#catch(onRejected) -> Promise
         *  - onRejected (Function): Function to execute when the promise is
         *    rejected.
         *
         *  A helper function for executing a function when the promise is
         *  rejected.
         **/
        catch: function (onRejected) {
            return this.then(undefined, onRejected);
        }

    };

    /**
     *  Promise.all(promises) -> Promise
     *  - promises (Array): [[Promise]] instances.
     *
     *  Creates a [[Promise]] that resolves when all the `promises` have
     *  resolved. If any of the reject, the returned [[Promise]] is rejected.
     *  Data from each of the promises are passed to the callback.
     *
     *      Promise.all([
     *          Promise.resolve(1),
     *          Promise.resolve(2),
     *          Promise.resolve(3),
     *      ]).then(function (a, b, c) {
     *          console.log(a, b, c);
     *      });
     *      // logs 1, 2, 3
     *
     **/
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

    /**
     *  Promise.race(promises) -> Promise
     *  - promises (Array): [[Promise]] instances.
     *
     *  Creates a promise that resolves as soon as the any of the promises
     *  resolve.
     **/
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

    /**
     *  Promise.resolve(data) -> Promise
     *  - data (?): Data for the promise.
     *
     *  Create a promise that is resolved with the given `data`.
     **/
    Prom.resolve = function (data) {

        return new Prom(function (resolve) {
            resolve(data);
        });

    };

    /**
     *  Promise.resolve(data) -> Promise
     *  - data (?): Data for the promise.
     *
     *  Create a promise that is rejected with the given `data`.
     **/
    Prom.reject = function (reason) {

        return new Prom(function (ignore, reject) {
            reject(reason);
        });

    };

    return Prom;

}());
