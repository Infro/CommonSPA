// require.js looks for the following global when initializing
var require = {
	baseUrl: ".",
	paths: {
		"bootstrap": "bower_modules/components-bootstrap/js/bootstrap",
		"underscore": "bower_modules/underscore/underscore",
		"underscore.string": "bower_modules/underscore.string/dist/underscore.string",
		"crossroads": "bower_modules/crossroads/dist/crossroads",
		"hasher": "bower_modules/hasher/dist/js/hasher",
		"jquery": "bower_modules/jquery/dist/jquery",
		// "jquery.validate":  "bower_modules/jquery-validation/dist/jquery.validate",
		"knockout": "bower_modules/knockout/dist/knockout.debug",
		"knockout-mapping" : "bower_modules/bower-knockout-mapping/dist/knockout.mapping",
		"knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
		"knockout-validation" : "bower_modules/knockout-validation/dist/knockout.validation",
		//https://github.com/millermedeiros/js-signals/wiki/Examples
		"signals": "bower_modules/js-signals/dist/signals.min",
		"text": "bower_modules/requirejs-text/text",
		"rx": "bower_modules/rxjs/dist/rs.all.compatd",
		"sitemap" : "app/sitemap",
		"lib" : "app/lib",
		'toastr': 'bower_modules/toastr/toastr',
		'chosen': 'bower_modules/chosen/chosen.jquery.min'
	},
	shim: {
		"bootstrap": { deps: ["jquery"] },
		"underscore.string": { deps: [ "underscore" ] },
		"chosen": { deps: ["jquery"] }
	}
};
