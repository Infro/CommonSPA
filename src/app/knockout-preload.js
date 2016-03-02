define(["jquery", "knockout"], function ($, ko) {
    ko.bindingHandlers.preload = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            /// Setting up options
            var va = valueAccessor();
            var defaults = {
                preloadData: element,
                delay: 100,
                observableToInform: va,
                eventsToTrigger: 'mouseenter mousemove',
                eventsToEndTrigger: 'mouseleave'
            };
            var extend = ko.utils.extend;
            var options = (va instanceof Object && !(ko.isObservable(va))) ? extend(extend({}, defaults), va) : defaults;

            /// Validating input
            if (!ko.isObservable(options.observableToInform) || !ko.isWriteableObservable(options.observableToInform)) {
                throw "The boundItem or boundItem.observableToInform must be a writeable observable.";
            }

            var updateObservable = function () { options.observableToInform(ko.utils.unwrapObservable(options.preloadData)); };
            var updateInternalObservableTrue = function () { element.preloadObservable(true); };
            var updateInternalObservableFalse = function () { element.preloadObservable(false); };
            var $element = $(element);
            element.preloadObservable = ko.observable();
            if (options.delay > 0) element.preloadObservable = element.preloadObservable.extend({
                notify: 'always',
                rateLimit: {
                    timeout: options.delay,
                    method: "notifyWhenChangesStop"
                }
            });

            /// Handling events
            var subscription = element.preloadObservable.subscribe(function (val) { if (val) { updateObservable(); } });

            $element.on(options.eventsToTrigger, updateInternalObservableTrue);
            $element.on(options.eventsToEndTrigger, updateInternalObservableFalse);

            /// Handling clean up
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                subscription.dispose();
                element.preloadObservable.dispose();
                $element.off(options.eventsToTrigger, updateInternalObservableTrue);
                $element.off(options.eventsToEndTrigger, updateInternalObservableFalse);
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever any observables/computeds that are accessed change
            // Update the DOM element based on the supplied values here.
        }
    };
});