define([
'jquery', 'knockout', './router',
'./preload', 'bootstrap', 'knockout-mapping', 'knockout-projections', 'knockout-validation', 'chosen'],
function ($, ko, router) {
	ko.mapping.defaultOptions().ignore = ["self"];
	ko.mapping.defaultOptions().id =  {
		key: function(data) {
            return ko.utils.unwrapObservable(data.id);
        }
	};
	
	ko.components.register('about-page', { template: { require: 'text!components/about-page/about-page.html' } });

	var namingConventionLoader = {
		getConfig: function(name, callback) {
			callback({ require: 'components/' + name + '/' + name });
		}
	};

	ko.components.loaders.push(namingConventionLoader);
	
	ko.validation.init({
		registerExtenders: true,
		messagesOnModified: true,
		insertMessages: true,
		parseInputAttributes: false,
		messageTemplate: null
		}, true);

	// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
	ko.applyBindings(router, document.getElementById("htmlElement"));
});
