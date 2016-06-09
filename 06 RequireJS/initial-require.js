var gotten = {};
var modules = {};
var scripts = {};

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

function getModule(name) {

    if (!gotten[url]) {

        gotten[url] = new Promise(function (resolve) {

            getScript(url).then(function () {
                resolve(defined[url]);
            });

        });

    }

    return gotten[url];

}

function require(names, callback) {

    var requests = Array.isArray(names)
        ? names
        : [names];

    return Promise.all(requests.map(getModule)).then(callback);

}

function define(name, requires, factory) {

    if (typeof requires === "function") {

        factory  = requires;
        requires = [];

    }

    modules[name] = require(requires, factory);

}
