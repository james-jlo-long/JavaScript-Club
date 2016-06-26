define([
    "website"
], function (
    website
) {

    "use strict";

    var Counter = function () {

        this.isCounting = false;
        this.reset();

    };

    website.util.Object.addConstants(Counter, {
        EVENT_START: "timer-counter-start",
        EVENT_PAUSE: "timer-counter-pause",
        EVENT_RESET: "timer-counter-reset",
        EVENT_UPDATE: "timer-counter-update"
    });

    Counter.prototype = {

        trigger: function (name, detail) {
            website.events.trigger(name, detail);
        },

        start: function (startTime) {

            if (!this.isCounting) {

                this.trigger(Counter.EVENT_START, this.startTime);
                this.isCounting = true;

            }

        },

        tick: function (timestamp) {

            if (!this.startTime) {
                this.startTime = timestamp;
            }

            this.trigger(Counter.EVENT_UPDATE, timestamp - this.startTime);

        },

        pause: function () {

            if (this.isCounting) {

                this.trigger(Counter.EVENT_PAUSE, this.startTime);
                this.isCounting = false;

            }

        },

        reset: function (startTime) {

            this.startTime = +startTime || 0;
            this.trigger(Counter.EVENT_RESET, this.startTime);

        },

        stop: function () {

            this.pause();
            this.reset();

        }

    };

    return Counter;

});
