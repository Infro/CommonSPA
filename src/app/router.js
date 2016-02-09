/// <reference path="../bower_modules/requirejs/require.js" />
/// <reference path="require.config.js" />

define(["knockout", "crossroads", "hasher", "sitemap", "mylib"], function (ko, crossroads, hasher, sitemap, lib) {
	var flattenSitemap = function(sitemapPages)
	{
		return lib.flattenRecursive(
			sitemapPages,
			function (object) {
				return object;
			},
			function (object) {
				return object.pages;
			}
		);
	}

	return new Router({
		routes: flattenSitemap(sitemap.pages)
	});
	
	// function Route(config)
	// {
		// return ko.utils.extend(config, {viewModel: ko.observable()})
	// }

	function Router(config) {
		var currentRoute = this.currentRoute = ko.observable({});
		var preloadRoute = this.preloadRoute = ko.observable({});
		var sitemap = sitemap;

		ko.utils.arrayForEach(config.routes, function (route) {
			if(route.url !== undefined) {
				crossroads.addRoute(route.url, function (requestParams) {
					route.params = {};
					var extendedRoute = ko.utils.extend(route.params, requestParams)
					currentRoute(route);
				});
				if(route.options && route.options.preloadable) {
					crossroads.addRoute('preload/' + route.url, function (requestParams) {
						// Before params can be added, needs a way to have preload to switch viewmodels between real and fake.
						route.params = {preloading: true};
						var extendedRoute = ko.utils.extend(route.params, requestParams)
						preloadRoute(route);
					});
				}
			}
		});
		activateCrossroads();
	}

	function activateCrossroads() {
		function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
		crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
		hasher.initialized.add(function (newHash, oldHash) {
			//Load Initial Page
			parseHash(newHash, oldHash);
			crossroads.parse('preload/' + newHash);
		});
		hasher.changed.add(parseHash);
		hasher.init();
	}
});