/**
 *  dom
 *
 *  Collection of utility functions for DOM manipulation.
 **/
var dom = {

    /**
     *  dom.starify(selector) -> String
     *  - selector (String): CSS selector to "starify".
     *
     *  Converts a CSS selector into a "starified" version of itself, allowing
     *  the selector to match the element and any children. This is mainly used
     *  to aid event delegation.
     *
     *      dom.starify("#id"); // -> "#id *,#id"
     *      dom.starify("#id,.class"); // -> "#id *,#id,.class *,.class"
     *
     **/
    starify: function (selector) {

        return selector
            .split(/\s*,\s*/)
            .map(function (sel) {
                return sel + " *," + sel;
            })
            .join(",");

    },

    /**
     *  dom.closest(element, selector) -> Element
     *  - element (Element): Element whose closest match should be returned.
     *  - selector (String): CSS selector to match.
     *
     *  Returns the closest parent to the `element` that matches the given
     *  `selector` (which may be the `element` itself).
     *
     *      <div id="one">
     *          <div id="two">
     *              <span id="three"></span>
     *          </div>
     *      </div>
     *
     *      var three = document.getElementById("three");
     *      dom.closest(three, "span"); // -> <span id="three">
     *      dom.closest(three, "div"); // -> <div id="two">
     *
     **/
    closest: function (element, selector) {

        while (element instanceof HTMLElement && !element.matches(selector)) {
            element = element.parentNode;
        }

        return element;

    },

    /**
     *  dom.trigger(element, name) -> Event
     *  - element (Element): Element which should trigger the event.
     *  - name (String): Name of the event.
     *
     *  Triggers an event on the given `element` and returns the triggered
     *  event. Events are allways set to be cancelable and they always bubble.
     **/
    trigger: function (element, name) {

        var event = new Event(name, {
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(event);

        return event;

    },

    /** related to: dom.bind, related to: dom.bind
     *  dom.on(element, event[, selector], handler)
     *  - element (Element): Element that should gain the handler.
     *  - event (String): Name of the event to listen for.
     *  - selector (String): Optional CSS selector for event delegation.
     *  - handler (Function): Event handler.
     *
     *  Binds an event handler to the given `element`. If a `selector` is
     *  provided, the event is delegated.
     **/
    on: function (element, event, selector, handler) {

        if (typeof handler === "undefined") {
            this.bind(element, event, selector);
        } else {
            this.delegate(element, event, selector, handler);
        }

    },

    /** related to: dom.on
     *  dom.bind(element, event, handler)
     *  - element (Element): Element that should gain the event handler.
     *  - event (String): Name of the event.
     *  - handler (Function): Event handler.
     *
     *  Binds an event to the given `element`. Don't call this method directly,
     *  instead use [[dom.on]] for the increased flexibility.
     **/
    bind: function (element, event, handler) {
        element.addEventListener(event, handler);
    },

    /** related to: dom.on
     *  dom.delegate(element, event, selector, handler)
     *  - element (Element): Element that should gain the event.
     *  - event (String): Event name.
     *  - selector (String): CSS selector identifying the children.
     *  - handler (Function): Event handler.
     *
     *  Binds a delegated event to the given `element`. Don't call this method
     *  directly, instead use [[dom.on]] for the increased flexibility.
     **/
    delegate: function (element, event, selector, handler) {

        element.addEventListener(event, function (e) {

            if (e.target.matches(dom.starify(selector))) {
                handler.call(dom.closest(e.target, selector), e);
            }

        });

    }

};
