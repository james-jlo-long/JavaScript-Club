(function (namespace) {

    "use strict";

    // Contains all information about a module that was given to the `define`
    // function.
    var modules = {};

    // A cache for all scripts passes to the `getScript` function. This allows
    // the `Promise` to be returned if the script has already been requested.
    var scripts = {};

    // A cache for all `Promise` instances for loading a module including all
    // dependencies.
    var promises = {};

    // A cache of all `Promise` instances for loading a dependency.
    var dependencies = {};

    // The first <script> tag on the page. This is more reliable than simply
    // appending to the <head> tag.
    var firstScript;

    /**
     *  getFirstScript() -> Element
     *
     *  Gets the first `<script>` tag on the page.
     **/
    function getFirstScript() {

        if (!firstScript) {
            firstScript = document.getElementsByTagName("script")[0];
        }

        return firstScript;

    }

    /**
     *  includeScript(url[, success[, error]])
     *  - url (String): Url of the script to load.
     *  - success (Function): Optional function to execute when the script has
     *    loaded.
     *  - error (Function): Optional function to execute if the script fails to
     *    load.
     *
     *  Loads a script by appending it to the head.
     **/
    function includeScript(url, success, error) {

        var script = document.createElement("script");
        var first = getFirstScript();

        script.src = url;
        script.type = "text/javascript";
        script.async = true;

        if (typeof success === "function") {
            script.onload = success;
        }

        if (typeof error === "function") {
            script.onerror = error;
        }

        first.parentNode.insertBefore(script, first);

    }

    /**
     *  getScript(url) -> Promise
     *  - url (String): URL of the script to load.
     *
     *  Creates a `Promise` that resolves when the script from the given `url`
     *  has loaded. If the script fails to load, the `Promise` is rejected.
     **/
    function getScript(url) {

        var promise;

        if (Array.isArray(url)) {
            promise = Promise.all(url.map(getScript));
        } else {

            promise = scripts[url];

            if (!promise) {

                promise = new Promise(function (resolve, reject) {
                    includeScript(url, resolve, reject);
                });
                scripts[url] = promise;

            }

        }

        return promise;

    }

    /**
     *  addModule(name[, depends]) -> Promise
     *  - name (String): Name of the module to add.
     *  - depends (Array): Optional array of dependency names to load as well.
     *
     *  Creates a `Promise` that resolves when all the associated dependencies
     *  have loaded. The `Promise` is resolved with the dependencies, all loaded
     *  with their dependencies, if any.
     **/
    function addModule(name, depends) {

        depends = depends || [];

        if (!promises[name]) {

            promises[name] = new Promise(function (resolve) {

                Promise
                    .all(depends.map(resolvedependency))
                    .then(resolve);

            });
        }

        return promises[name];

    }

    /**
     *  resolveDependency(name) -> Promise
     *  - name (String): Name of the dependency to resolve.
     *
     *  Creates a promise that resolves when the given dependency is loaded,
     *  which includes loading the script (see [[getScript]]) and adding the
     *  module (see [[addModule]]).
     **/
    function resolvedependency(name) {

        if (!dependencies[name]) {

            dependencies[name] = new Promise(function (resolve) {

                getScript(name).then(function () {

                    var mod = modules[name];

                    addModule(name, mod.depends).then(function (module) {
                        resolve(mod.callback.apply(undefined, module));
                    });

                });

            });

        }

        return dependencies[name];

    }

    /**
     *  define(name[, depends], callback)
     *  - name (String): Name of the module to define.
     *  - depends (Array): Optional dependencies.
     *  - callback (Function): Callback to execute when the dependencies have
     *    loaded.
     *
     *  The public interface for defining a module. The `callback` will execute
     *  as soon as all the dependencies have loaded and the `callback` is passed
     *  those modules.
     **/
    function define(name, depends, callback) {

        if (typeof depends === "function") {

            callback = depends;
            depends = [];

        }

        modules[name] = {
            name: name,
            depends: depends,
            callback: callback
        };

        addModule(name, depends).then(function (mods) {
            callback.apply(undefined, mods);
        });

    }

    /**
     *  require(depends, callback)
     *  - depends (String|Array): Dependency/ies to load.
     *  - callback (Function): Function to execute when the dependencies have
     *    loaded.
     *
     *  Loads the required dependencies then executes the function. The
     *  dependencies are passed to the callback. This is basically the same as
     *  [[define]] except that the module does not need to be defined, merely
     *  accessed.
     **/
    function require(depends, callback) {

        if (!Array.isArray(depends)) {
            depends = [depends];
        }

        Promise.all(depends.map(resolvedependency)).then(function (mods) {
            callback.apply(undefined, mods);
        });

    }

    namespace.define = define;
    namespace.require = require;

}(window));
