define(['knockout'], function(ko) {
	function Preloadable(route, constructor) {
		if (!route.options.persistant || !route.viewModel) {
			route.viewModel = new constructor();
		}
		return route.viewModel;
	}
	
	return Preloadable;
});