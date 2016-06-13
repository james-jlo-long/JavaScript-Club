//var gotten = {};
var modules = {};
var scripts = {};

function includeScript(url, success, error) {

    var script = document.createElement("script");

    script.src = url;
    script.type = "text/javascript";
    script.async = true;

    if (typeof success === "function") {
        //script.onload = success;
        script.onload = function () { console.log("script %o loaded", url); success(); }
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


var promises = {};
var modules = {};
var dependancies = {};

function addModule(name, depends) {
console.log("%c addModule(%o, %o)", "background-color:#FCC;", name, depends);
    depends = depends || [];

    if (!promises[name]) {
console.log("%c creating promises[%s]", "background-color:#FCC;", name);
        promises[name] = new Promise(function (resolve) {

            Promise
                .all(depends.map(resolveDependancy))
                .then(function (values) {
console.log("%c resolving from %o with values %o", "background-color:#FCC;", name, values);
                    resolve(values);
                });

        });
    }

    return promises[name];

}

function resolveDependancy(name) {
console.log("%c resolveDependancy(%o)", "background-color:#CFC;", name);
    if (!dependancies[name]) {

        dependancies[name] = new Promise(function (resolve) {

            getScript(name).then(function () {
console.log("%c getScript(%o) loaded; modules[%s] = %o", "background-color:#CFC;", name, name, modules[name]);
                addModule(name, modules[name].depends).then(function (module) {
console.log("%c addModule(%o, %o) resolved and given %o; passing %o", "background-color:#CFC;", name, modules[name].depends, module, modules[name].callback);
                    //resolve(module);
                    resolve(
//                         modules[name].callback.apply(undefined, module.map(function (m, i) {
// console.log("%c mapping module[%d] %o -> m = %o", "background-color:#CFC;", i, module, m);
//                             return m();
//                         }))
                        modules[name].callback.apply(undefined, module)
                    );
                });

            });

        });

    }

    return dependancies[name];

}

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

function require(depends, callback) {

    Promise.all(depends.map(resolveDependancy)).then(function (mods) {
        callback.apply(undefined, mods);
    });

}



/*function getModule(module) {
    return modules[name];
}

function require(names, callback) {

    var requests = Array.isArray(names)
        ? names
        : [names];

    return callback.apply(undefined, requests.map(getModule));

}

function define(name, requires, factory) {

    if (typeof requires === "function") {

        factory  = requires;
        requires = [];

    }

    modules[name] = require(requires, factory);

}*/

/*
var Module = function (name) {

    if (typeof name === "string") {
        this.setName(name);
    }

    this.required = [];

};

Module.prototype = {

    setName: function (name) {
        this.name = name;
    },

    setDepends: function (depends) {

        if (depends && !Array.isArray(depends)) {
            depends = [depends];
        }

        this.depends = depends;

    },

    loadDepends: function () {

        if (!this.promise) {

            this.promise = new Promise(function (resolve) {

                Promise.all(this.depends.map(Module.load)).then(function () {
                });

            });

        }

        return this.promise;

    },

    then: function (onFulfilled, onRejected) {
        this.loadRequired().then(onFulfilled, onRejected);
    },

    catch: function (onRejected) {
        this.loadRequired().catch(onRejected);
    }

};

Module.modules = {};

Module.has = Object.prototype.hasOwnProperty.bind(Module.modules);

Module.get = function (name) {
    return Modules.module[name];
};

Module.set = function (name) {
    Modules.module[name] = new Module(name);
};

Module.create = function (name) {

    if (!Module.has(name)) {
        Module.set(name);
    }

    return Module.get(name);

};

// -> Promise
Module.load = function (name) {

    return new Promise(function (resolve) {

        getScript(name).then(function () {
            resolve(Module.create(name));
        });

    });

};

function define(name, depends, callback) {

    var module = Module.create(name);

    if (typeof depends === "function") {

        callback = depends;
        depends = [];

    }

    module.setDepends(depends);
    module.then(function (values) {
        callback.apply(undefined, values);
    });

}
*/


/*
var defined = {};
function getModule(name) {

console.log("%c getModule(%o)", "background-color:#FCC", name);
    if (!modules[name]) {
console.log("%c defining %o module", "background-color:#FCC", name);
        modules[name] = new Promise(function (resolve) {

            getScript(name).then(function () {
console.log("%c getScript(%o) has loaded, resolving with %o", "background-color:#FCC", name, defined[name]);
                resolve(defined[name]);
            });

        });

    }

    return modules[name];

}

function require(depends, factory) {

    if (!Array.isArray(depends)) {
        depends = [depends];
    }

    return Promise.all(depends.map(getModule)).then(function (mods) {
console.log("%c require %o => %o", "background-color:#CFC", depends, mods);
        factory.apply(undefined, mods);
    });

}

function define(name, depends, factory) {

    if (typeof depends === "function") {

        factory = depends;
        depends = [];

    }
console.log("%c define(%o) has created depends %o => %o", "background-color:#CCF", name, depends, depends.map(getModule));
    Promise.all(depends.map(getModule)).then(function (mods) {
console.log("%c defining %o with mods %o ...", "background-color:#CCF", name, mods);
        defined[name] = factory.apply(undefined, mods);
console.log("%c ... an creating %o", "background-color:#CCF", defined[name]);
    });

}
*/


/*
Am I just getting the Promise for the script itself, not the dependancies?
 */
/*
function getModule(name) {
    return modules[name];
}

function applyFactory(factory, depends) {
console.log("applyFactory from %s %o => %o", arguments[2], depends, depends.map(getModule));
    return factory.apply(undefined, depends.map(getModule));
}

function require(depends, factory) {

    if (!Array.isArray(depends)) {
        depends = [depends];
    }
console.log("require has depends %o =>", depends, depends.map(getScript));
    Promise.all(depends.map(getScript)).then(function () {
        applyFactory(factory, depends, "require");
    });

}

function define(name, depends, factory) {

    if (typeof depends === "function") {

        factory = depends;
        depends = [];

    }
console.log("define %o has depends %o =>", name, depends, depends.map(getScript));
    Promise.all(depends.map(getScript)).then(function () {
        modules[name] = applyFactory(factory, depends, "define");
    });

}
*/



/*function require(depends, factory) {

    var deps = Array.isArray(depends)
        ? depends
        : [depends]
    var mods = deps.concat();

    if (mods.length) {
        mods = mods.map(getScript);
    } else {
        mods.push(Promise.resolve());
    }

    Promise.all(mods).then(function () {
//console.log("(deps %o) mods %o => values %o", deps, mods, values);
        factory.apply(undefined, deps.map(d => modules[d]);
    });

}

function define(name, depends, factory) {

    if (typeof depends === "factory") {

        factory = depends;
        depends = [];

    }

    // Not defining anything just yet ...
    require(depends, factory);

    // if (!modules[name]) {
    //
    //
    //
    // }

    // modules[name].then(function () {
    //     factory.apply(undefined, depends.map
    // });

}*/


/*function require(depends, factory) {

    var deps = Array.isArray(depends)
        ? depends
        : [depends];
    var prom = depends.length
        ? getScript(depends)
        : Promise.resolve();
console.log("depends = %o \nprom = %o", depends, prom);
    prom.then(function () {
console.log("prom.then modules are %o, %o => %o", modules, depends, depends.map(d => modules[d]));
        factory.apply(undefined, depends.map(function (name) {
            return modules[name];
        }));

    }
//, function () { console.error("require(%o) died: %o", depends, arguments); }
    );

}

function define(name, depends, factory) {

    if (typeof depends === "function") {

        factory = depends;
        depends = [];

    }
//console.log("define(%o, %o, %o)", name, depends, factory);
    require(depends, function () {
//console.log("defining %o using %o", name, arguments);
        modules[name] = factory.apply(undefined, arguments);
    });

}*/





/*

function getModule(name) {

    if (!gotten[name]) {

        gotten[name] = new Promise(function (resolve) {

            getScript(name).then(function () {
console.log("getScript(%o).then passing modules[%o] (%o) = %o", name, name, modules, modules[name]);
// Maybe don't resolve here? populate then resolve?
                resolve(modules[name]);
            });

        });

    }

    return gotten[name];

}

function require(names, callback) {

    var requests = Array.isArray(names)
        ? names
        : [names];

    return Promise.all(requests.map(getModule)).then(function (values) {
console.log("require(%o, %o) gives values %o", names, callback, values);
        callback.apply(undefined, values);
    });

}

function define(name, requires, factory) {

    if (typeof requires === "function") {

        factory  = requires;
        requires = [];

    }

// becuase require() is returning a promise, modules[name] is a promise when it should be the module!
    modules[name] = require(requires, factory);

}
*/
