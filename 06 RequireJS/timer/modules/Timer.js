define([
    "website",
    "modules/Timer/config",
    "modules/Timer/Render",
    "modules/Timer/Interval",
    "modules/Timer/Counter",
    "modules/Timer/Date"
], function (
    website,
    config,
    Render,
    Interval,
    Counter,
    Date
) {

    "use strict";

    var dom = website.dom;
    var events = website.events;

    var Timer = function () {

        this.setObjects();
        this.addHandlers();

    };

    Timer.prototype = {

        setObjects: function () {

            this.render = new Render(dom.byQuery(config.selectors.base));
            this.interval = new Interval();
            this.counter = new Counter();

        },

        // Notice how this is the only place that the dependencies are working
        // together - the individual modules know nothing about each other
        // -- JLo
        addHandlers: function () {

            var selectors = config.selectors;
            var counter = this.counter;

            dom.onByQuery(selectors.start, "click", counter.start, counter);
            dom.onByQuery(selectors.pause, "click", counter.pause, counter);
            dom.onByQuery(selectors.reset, "click", counter.reset, counter);
            dom.onByQuery(selectors.stop, "click", counter.stop, counter);

            events.listen(Counter.EVENT_UPDATE, function (e) {
                this.update(e.detail);
            }, this);

            events.listen(Counter.EVENT_START, function (e) {
                this.interval.start();
            }, this);

            events.listen(Counter.EVENT_PAUSE, function (e) {
                this.interval.stop();
            }, this);

            events.listen(Interval.EVENT_TICK, function (e) {
                this.counter.tick(e.detail);
            }, this);

        },

        pad: function (time, length) {
            return website.util.String.pad(time, length, "0", "left");
        },

        update: function (timestamp) {

            var date = new Date(timestamp);

            this.render.display({
                hours: date.getUTCHours(),
                minutes: this.pad(date.getMinutes(), 2),
                seconds: this.pad(date.getSeconds(), 2),
                milliseconds: this.pad(date.getMilliseconds(), 3)
            });

        }

    };

    return Timer;

});
