define([
'jquery', 'knockout', './router',
'./knockout-preload', 'bootstrap', 'knockout-mapping', 'knockout-projections', 'knockout-validation', 'chosen', 'knockstrap',
'knockout-dragdrop'],
function ($, ko, router) {
	(function() { //Knockout-Mapping: Set Defaults
	ko.mapping.defaultOptions().ignore = ["validation"];
	ko.mapping.defaultOptions().id =  {
		key: function(data) {
            return ko.utils.unwrapObservable(data.id);
        }
	};
	})();
	
	(function() { //Knockout: Add Custom  Bindings
	ko.bindingHandlers.stopBinding = {
		init: function() {
			return { controlsDescendantBindings: true };
		}
	};
	ko.virtualElements.allowedBindings.stopBinding = true;
	})();
	
	(function() { //Knockout: Components and Component Naming Convention
	ko.components.register('about-page', { template: { require: 'text!components/about-page/about-page.html' } });

	var namingConventionLoader = {
		getConfig: function(name, callback) {
			callback({ require: 'components/' + name + '/' + name });
		}
	};

	ko.components.loaders.push(namingConventionLoader);
	})();
	
	(function() { //Knockout-Validation: Defaults
	ko.validation.init({
		registerExtenders: true,
		messagesOnModified: false,
		insertMessages: false,
		parseInputAttributes: false,
		messageTemplate: null
		}, true);
	})();

	// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
	ko.applyBindings(router, document.getElementById("htmlElement"));
});
