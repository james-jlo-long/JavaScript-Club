define([
    "website",
    "modules/Timer/config"
], function (
    website,
    config
) {

    "use strict";

    var dom = website.dom;

    var Render = function (base) {
        this.findElements(base);
    };

    Render.prototype = {

        findElements: function (base) {

            var selectors = config.selectors;

            this.hours = dom.byQuery(selectors.hours, base);
            this.minutes = dom.byQuery(selectors.minutes, base);
            this.seconds = dom.byQuery(selectors.seconds, base);
            this.milliseconds = dom.byQuery(selectors.milliseconds, base);

        },

        display: function (times) {

            Object.keys(times).forEach(function (time) {

                if (this[time]) {
                    this[time].textContent = times[time];
                }

            }, this);

        }

    };

    return Render;

});
