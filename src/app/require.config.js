// require.js looks for the following global when initializing
var require = {
	baseUrl: '.',
	paths: {
		'bootstrap': 'bower_modules/components-bootstrap/js/bootstrap',
		'underscore': 'bower_modules/underscore/underscore',
		'underscore.string': 'bower_modules/underscore.string/dist/underscore.string',
		'crossroads': 'bower_modules/crossroads/dist/crossroads',
		'hasher': 'bower_modules/hasher/dist/js/hasher',
		'jquery': 'bower_modules/jquery/dist/jquery',
		'knockout': 'bower_modules/knockout/dist/knockout.debug',
		'knockout-mapping' : 'bower_modules/bower-knockout-mapping/dist/knockout.mapping',
		'knockout-projections': 'bower_modules/knockout-projections/dist/knockout-projections',
		'knockout-validation' : 'bower_modules/knockout-validation/dist/knockout.validation',
		'knockout.google.maps': 'bower_modules/knockout.google.maps/dist/knockout.google.maps-0.2.0.debug',
		'knockstrap': 'bower_modules/knockstrap/build/knockstrap',
		'knockout-dragdrop': 'bower_modules/knockout-dragdrop/lib/knockout.dragdrop',
		'signals': 'bower_modules/js-signals/dist/signals.min',
		'text': 'bower_modules/requirejs-text/text',
		'rx': 'bower_modules/rxjs/dist/rs.all.compatd',
		'sitemap': 'app/sitemap',
		'mylib': 'app/mylib',
		'api': 'app/api',
		'toastr': 'bower_modules/toastr/toastr',
		'chosen': 'bower_modules/chosen/chosen.jquery',
		'googlemaps': '//maps.googleapis.com/maps/api/js',
	},
	shim: {
		'bootstrap': { deps: ['jquery'] },
		'underscore.string': { deps: [ 'underscore' ] },
		'chosen': { deps: ['jquery'] }
	}
};
