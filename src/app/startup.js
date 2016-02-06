define([
'jquery', 'knockout', './router',
'./preload', 'bootstrap', 'knockout-projections', 'knockout-mapping', 'jquery.validate', 'chosen'],
function ($, ko, router) {
	ko.mapping.defaultOptions().ignore = ["self"];
	ko.components.register('about-page', { template: { require: 'text!components/about-page/about-page.html' } });

	var namingConventionLoader = {
		getConfig: function(name, callback) {
			callback({ require: 'components/' + name + '/' + name });
		}
	};

	ko.components.loaders.push(namingConventionLoader);
	// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
	ko.applyBindings(router, document.getElementById("htmlElement"));
});
