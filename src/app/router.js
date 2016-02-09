/// <reference path="../bower_modules/requirejs/require.js" />
/// <reference path="require.config.js" />

define(["knockout", "crossroads", "hasher", "sitemap", "mylib"], function (ko, crossroads, hasher, sitemap, lib) {
	function Router(config) {
		var componentView1 = this.componentView1 = ko.observable({});
		var componentView2 = this.componentView2 = ko.observable({component: 'blank-page'});
		var preloadData = this.preloadData = ko.observable();
		var viewToggle = this.viewToggle = ko.observable(true);
		var currentRoute = this.currentRoute = ko.pureComputed(function() { return viewToggle() ? componentView1() : componentView2(); });
		viewToggle.toggle = function() {
			viewToggle(!viewToggle.peek());
		};
		
		preloadData.subscribe(function (data) {
			var href = data().href;
			var pageToPreload;
			if (href.hash)
			{ pageToPreload = href.hash.substr(1); }
			else
			{ pageToPreload = href.substr(href.indexOf('#') + 1); }
			crossroads.parse('preload' + pageToPreload);
		});
		
		var displayedView = ko.pureComputed(function() {
			if(viewToggle())
			{ return componentView1(); }
			else
			{ return componentView2(); }
		});

		var getViews = function() {
			if(viewToggle.peek())
				return {
					currentView: componentView1,
					preloadedView: componentView2
				};
			else
				return {
					currentView: componentView2,
					preloadedView: componentView1
				};
		};
		
		ko.utils.arrayForEach(config.routes, function (route) {
			if(route.url !== undefined) {
				crossroads.addRoute(route.url, function (requestParams) {
					var views = getViews();

					if(views.preloadedView.peek() == route && lib.memberwiseEqual(route.params, requestParams)) {
					}
					else {
						route.params = requestParams;
						views.preloadedView(route);
					}
					viewToggle.toggle();
					views.currentView({component: 'blank-page'});
				});
				if(route.options && route.options.preloadable) {
					crossroads.addRoute('preload/' + route.url, function (requestParams) {
						route.params = requestParams;
						getViews().preloadedView(route);
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
		});
		hasher.changed.add(parseHash);
		hasher.init();
	}

	var flattenedSitemap = lib.flattenRecursive(
		sitemap.pages,
		function (object) {
			return object;
		},
		function (object) {
			return object.pages;
		}
	);

	return new Router({
		routes: flattenedSitemap
	});
	
});