var createClass = (function () {

    "use strict";

    var addMethod = function (Func, name, method) {

        var parent = Func.parent;

        Func.prototype[name] = (

            // Make sure that the new and parent properties are both functions
            // and that the new property wants to use the magic $super property.
            typeof method === "function"
            && typeof parent[name] === "function"
            && (/[\.'"]\$super\b/).test(method)

        )

            // If so, modify the property to create the $super method as needed.
            ? function () {

                // Back up the $super property, just in case.
                var temp = this.$super;
                var ret;

                // Set the $super property, execute the method then set it back.
                this.$super = parent[name];
                ret = method.apply(this, arguments);
                this.$super = temp;

                // Return whatever the method returned.
                return ret;

            }

            // If not, just set the method or property as normal.
            : method;

    };

    var create = function (Base, proto) {

        // Create the base function.
        var F = function () {
            return this.init.apply(this, arguments);
        };

        // Allow Base to be optional.
        if (!proto) {

            proto = Base;
            Base = Object;

        }

        // Create a reference to the parent and set the prototype.
        F.parent = Base.prototype;
        F.prototype = Object.create(Base.prototype);

        // Add the properties from proto onto F.prototype.
        Object.keys(proto).forEach(function (name) {
            addMethod(F, name, proto[name]);
        });

        // Allow the developer to add new methods that can use our magic method.
        F.addMethod = function (name, method) {
            addMethod(F, name, method);
        };

        F.addMethods = function (methods) {

            Object.keys(methods).forEach(function (name) {
                addMethod(F, name, methods[name]);
            });

        };

        // http://ejohn.org/blog/simple-javascript-inheritance/#comment-299629
        F.prototype.constructor = F;

        // Add an empty init, if we need one.
        if (typeof F.prototype.init !== "function") {

            F.prototype.init = function () {
                return;
            };

        }

        // Return our new class.
        return F;
    };

    return create;

}());
