define(['knockout'], function(ko) {
	// Persistable
    return function (route, constructor) {
        if (!route || !route.options || !route.options.persistant || !route.viewModel) {
            route.viewModel = new constructor();
        }
        return route.viewModel;
    };
});