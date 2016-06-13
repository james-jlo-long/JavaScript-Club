var promises = {};
var modules = {};
var dependancies = {};

function addModule(name, depends) {

    depends = depends || [];

    if (!promises[name]) {

        promises[name] = new Promise(function (resolve) {

            Promise
                .all(depends.map(resolveDependancy))
                .then(function (values) {
                    resolve(values);
                });

        });
    }

    return promises[name];

}

function resolveDependancy(name) {

    if (!dependancies[name]) {

        dependancies[name] = new Promise(function (resolve) {

            getScript(name).then(function () {

                addModule(name, modules[name].depends).then(function (module) {
                    resolve(module);
                });

            });

        });

    }

    return dependancies[name];

}

function define(name, depends, callback) {

    modules[name] = {
        name: name,
        depends: depends
    };

    addModule(name, depends).then(function (mods) {
        callback.apply(undefined, mods);
    });

}

function require(depends, callback) {

    Promise.all(depends.map(resolveDependancies)).then(function (mods) {
        callback.apply(undefined, mods);
    });

}
