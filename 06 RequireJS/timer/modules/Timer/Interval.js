define([
    "website"
], function (
    website
) {

    "use strict";

    var Interval = function () {
    };

    website.util.Object.addConstants(Interval, {
        EVENT_TICK: "timer-interval-tick",
        EVENT_STOP: "timer-interval-stop"
    });

    Interval.prototype = {

        start: function () {

            var that = this;

            that.id = window.requestAnimationFrame(function (timestamp) {

                website.events.trigger(Interval.EVENT_TICK, timestamp);
                that.start();

            });

        },

        stop: function () {

            window.cancelAnimationFrame(this.id);
            delete this.id;
            website.events.trigger(Interval.EVENT_STOP);

        }

    };

    return Interval;

});
