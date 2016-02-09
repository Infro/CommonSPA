define(['knockout'], function(ko) {
	// Persistable
	return function(route, constructor) {
		if (!route.options.persistant || !route.viewModel) {
			route.viewModel = new constructor();
		}
		return route.viewModel;
	}
});