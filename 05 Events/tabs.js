/**
 *  tabs
 *
 *  Handles a simple tab changer.
 **/
var tabs = {

    /**
     *  tabs#init(element)
     *  - element (Element): Tab containing element.
     *
     *  Sets up the tabs and binds appropriate events. `element` should be an
     *  element that contains all tabs and panels.
     **/
    init: function (element) {

        /**
         *  tabs#element -> Element
         *
         *  An element containing all tabs and panels.
         **/
        this.element = element;

        /**
         *  tabs#cache -> Object
         *
         *  A cache for [[tabs#getSelector]] to save on DOM lookups.
         **/
        this.cache = {};

        this.addHandlers();
        this.showTab(this.getSelector(".js-tabs-tab"));

    },

    /**
     *  tabs#getSelector(selector) -> Element|null
     *  - selector (String): CSS selector to find.
     *
     *  Finds the first element that matches the given `selector` within
     *  [[tabs#element]]. Results are cached in [[tabs#cache]] to reduce the
     *  number of DOM lookups.
     **/
    getSelector: function (selector) {

        var cache = this.cache;

        if (!cache[selector]) {
            cache[selector] = this.element.querySelector(selector);
        }

        return cache[selector];

    },

    /**
     *  tabs#addHandlers()
     *
     *  Adds event handlers to the appropriate elements.
     **/
    addHandlers: function () {

        var that = this;

        dom.on(that.element, "click", ".js-tabs-tab", function (e) {

            e.preventDefault();
            that.request(this);

        });

    },

    /**
     *  tabs#request(tab)
     *  - tab (Element): Tab element.
     *
     *  Attempts to hide the active panel and show the panel related to the
     *  given `tab`. If both attempts were successful, the `"tabchange"` event
     *  is triggered on [[tabs#element]].
     **/
    request: function (tab) {

        var hasLeft = this.hidePanel(this.active);
        var hasEntered = false;

        if (hasLeft) {
            hasEntered = this.showTab(tab);
        }

        if (hasEntered) {
            dom.trigger(this.element, "tabchange");
        }

    },

    /**
     *  tabs#hide(info) -> Boolean
     *  - info (Object): An object containing the `tab` and `panel` to hide.
     *
     *  Attempts to hide the given `tab` and `panel`. The attempt is made by
     *  triggering the `"tableave"` event on the `panel` (which will bubble up
     *  to [[tabs#element]]) and checking whether or not the default action was
     *  prevented, the `tab` and `panel` are hidden if the default was not
     *  prevented. A boolean is returned that is `true` if the default was not
     *  prevented and `false` if it was.
     **/
    hide: function (info) {

        var event = dom.trigger(info.panel, "tableave");
        var canLeave = !event.defaultPrevented;

        if (canLeave) {

            info.tab.classList.remove("is-active");
            info.panel.classList.remove("is-visible");

        }

        return canLeave;

    },

    /**
     *  tabs#show(info) -> Boolean
     *  - info (Object): An object containing the `tab` and `panel` to show.
     *
     *  Attempts to show the given `tab` and `panel`. The attempt is made by
     *  triggering the `"tabenter"` event on the `panel` (which will bubble up
     *  to [[tabs#element]]) and checking whether or not the default action was
     *  prevented, the `tab` and `panel` are shown if the default was not
     *  prevented. A boolean is returned that is `true` if the default was not
     *  prevented and `false` if it was.
     **/
    show: function (info) {

        var event = dom.trigger(info.panel, "tabenter");
        var canEnter = !event.defaultPrevented;

        if (canEnter) {

            info.tab.classList.add("is-active");
            info.panel.classList.add("is-visible");
            this.active = info.panel;

        }

        return canEnter;

    },

    /** related to: tabs#hide
     *  tabs#hideTab(tab) -> Boolean
     *  - tab (Element): Tab element to hide.
     *
     *  A helper function for hiding a tab and panel. This method takes the
     *  `tab`, finds the associated `panel` and passes both to [[tabs#hide]].
     *  The result of [[tabs#hide]] is returned.
     **/
    hideTab: function (tab) {

        return this.hide({
            tab: tab,
            panel: this.getPanel(tab)
        });

    },

    /** related to: tabs#hide
     *  tabs#hidePanel(panel) -> Boolean
     *  - panel (Element): Panel element to hide.
     *
     *  A helper function for hiding a tab and panel. This method takes the
     *  `panel`, finds the associated `tab` and passes both to [[tabs#hide]].
     *  The result of [[tabs#hide]] is returned.
     **/
    hidePanel: function (panel) {

        return this.hide({
            tab: this.getTab(panel),
            panel: panel
        });

    },

    /** related to: tabs#show
     *  tabs#showTab(tab) -> Boolean
     *  - tab (Element): Tab element to show.
     *
     *  A helper function for showing a tab and panel. This method takes the
     *  `tab`, finds the associated `panel` and passes both to [[tabs#show]].
     *  The result of [[tabs#show]] is returned.
     **/
    showTab: function (tab) {

        return this.show({
            tab: tab,
            panel: this.getPanel(tab)
        });

    },

    /** related to: tabs#show
     *  tabs#showPanel(tab) -> Boolean
     *  - panel (Element): Panel element to show.
     *
     *  A helper function for showing a tab and panel. This method takes the
     *  `panel`, finds the associated `tab` and passes both to [[tabs#show]].
     *  The result of [[tabs#show]] is returned.
     **/
    showPanel: function (panel) {

        return this.show({
            tab: this.getTab(panel),
            panel: panel
        });

    },

    /**
     *  tabs#getPanel(tab) -> Element|null
     *  - tab (Element): Tab whose associated panel should be returned.
     *
     *  Gets the associated panel from the given `tab`. If the panel can not be
     *  found, `null` is returned.
     **/
    getPanel: function (tab) {
        return this.getSelector(tab.getAttribute("href"));
    },

    /**
     *  tabs#getTab(panel) -> Element|null
     *  - panel (Element): Panel whose associated tab should be returned.
     *
     *  Gets the associated tab from the given `panel`. If the tab can not be
     *  found, `null` is returned.
     **/
    getTab: function (panel) {
        return this.getSelector(".js-tabs-tab[href=\"#" + panel.id + "\"]");
    }

};
