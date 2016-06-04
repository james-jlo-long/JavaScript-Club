var SIZE = (function () {

    "use strict";

    var assign = Object.assign || function (source) {

        Array
            .prototype
            .slice
            .call(arguments, 1)
            .forEach(function (object) {

                Object.keys(object).forEach(function (key) {
                    source[key] = object[key];
                });

            });

        return source;

    };

    var size = {};

    var sizes = {
        XS: 480,
        SM: 768,
        MD: 992,
        LG: 1200
    };

    var breakpoints = Object
        .keys(sizes)
        .map(function (key) {
            return sizes[key];
        })
        .sort(function (a, b) {
            return a - b;
        });

    var currentPoint = -1;

    var getWidth = null;

    function trigger(size) {

        window.dispatchEvent("sizechange", {
            bubbles: true,
            cancelable: true,
            details: {
                size: size,
                sizes: assign({}, sizes)
            }
        });

    }

    function getSizeIndex(width) {

        var index = breakpoints.length;

        do {
            index -= 1;
        } while (width < breakpoints[index] && index > 0);

        return index;

    }

    // This function is based on the work of Tyson Matanich.
    // https://github.com/tysonmatanich/viewportSize
    function createGetWidth() {

        var innerGetWidth = function () {
            return window.innerWidth;
        };

        // These variables mainly aid minification.
        var html = document.documentElement;
        var winInner = window.innerWidth;
        var htmlClient = html.clientWidth;

        // These variables are used if there is a difference in winInner and
        // htmlClient - only one would be correct.
        var body = null;
        var div = null;

        if (typeof winInner !== "number") {

            innerGetWidth = function () {
                return html.clientWidth;
            };

        } else if (winInner !== htmlClient) {

            body = document.createElement("body");
            body.id = "vpw-test-b";
            body.style.cssText = "overflow:scroll";

            div = document.createElement("div");
            div.id = "vpw-test-d";
            div.style.cssText = "position:absolute;top:-1000px;";

            div.innerHTML = "<style>@media(width:" + htmlClient + "px){" +
                "body#" + body.id + " div#" + div.id + "{" +
                "width:7px!important}}<\/style>";

            body.appendChild(div);
            html.insertBefore(body, document.head);

            if (div.offsetWidth === 7) {

                innerGetWidth = function () {
                    return html.clientWidth;
                };

            }

            html.removeChild(body);

        }

        getWidth = innerGetWidth;
        size.getWidth = innerGetWidth;

    }

    function checkSize(width) {

        var index = getSizeIndex(width);

        if (index !== currentPoint) {

            currentPoint = index;
            trigger(breakpoints[index]);

        }

    }

    function handleResize() {

        if (typeof getWidth !== "function") {
            createGetWidth();
        }

        checkSize(getWidth());

    }

    function onchange(handler) {
        window.addEventListener("sizechange", handler);
    }

    function offchange(handler) {
        window.removeEventListener("sizechange", handler);
    }

    assign(size, {
        onchange: onchange,
        offchange: offchange
    });

    Object.keys(sizes).forEach(function (name) {

        Object.defineProperty(size, name, {
            configurable: false,
            enumerable: true,
            value: sizes[name],
            writable: false
        });

    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    document.addEventListener("DOMContentLoaded", handleResize);

    return size;

}());
