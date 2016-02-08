define(["jquery", "knockout", "crossroads", "hasher"], function ($, ko, crossroads, hasher) {
  ko.bindingHandlers.preload = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element = $(element);
      var getHref = function() {
        // var preloadSettings = ko.unwrap(valueAccessor());
		// preloadSettings.delay
		// preloadSettings.target
		// preloadSettings.interm
        var href = ko.unwrap(valueAccessor());
        if (href.hash) {
          return href.hash.substr(1);
        }
        else {
          return href.substr(href.indexOf('#') + 1);
        }
      };
      element.preloadObservable = ko.observable().extend({
        notify: 'always',
        rateLimit: {
          timeout: 100, method: "notifyWhenChangesStop"
        }
      });
      $element.on('mouseenter', function () {
        element.preloadObservable(true);
      });
      $element.on('mousemove', function () {
        element.preloadObservable(true);
      });
      $element.on('mouseleave', function () {
        element.preloadObservable(false);
      });
      element.preloadObservable.subscribe(function (val) {
        if (val) {
		  if((bindingContext.$root.currentRoute().url != getHref()) &&
		     (bindingContext.$root.preloadRoute().url != getHref())) {
            crossroads.parse('preload' + getHref());
		  }
        }
      });
      $element.on('click', function (event) {
        if (bindingContext.$root.preloadRoute().url == getHref()) {
          bindingContext.$root.currentRoute(bindingContext.$root.preloadRoute());
          event.preventDefault();
          hasher.changed.active = false;
          hasher.setHash(getHref()); //set hash without dispatching changed signal
          hasher.changed.active = true;
        }
      });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called once when the binding is first applied to an element,
      // and again whenever any observables/computeds that are accessed change
      // Update the DOM element based on the supplied values here.
    }
  }
});