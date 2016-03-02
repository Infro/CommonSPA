define([
	'jquery',
	'underscore',
	'knockout',
	'text!./map-page.html',
	'components/common/persistable',
	'components/common/basecomponent',
	'toastr',
	'knockout.google.maps',
	'googlemaps'
],
function($, _, ko, mapTemplate, Persistable, Base, toastr) {
	var searchUrl;
	var callingUrl;
	
	var getPosition = function(latitude, longitude) {
		return {
			read: function () {
				return new google.maps.LatLng(latitude(), longitude());
			},
			write: function (value) {
				latitude(value.lat());
				longitude(value.lng());
			}
		};
	}
	
	function MapViewModel() {
		Base.call(this);
		this.searchParameter = ko.observable('');
		this.searchParameter.subscribe(handleSearch);
		
		this.businesses = ko.observableArray([]);
		this.currentBusiness = ko.observable();

		
		this.latitude = ko.observable();
		this.longitude = ko.observable();
		
		this.center = ko.pureComputed(getPosition(this.latitude, this.longitude));
		this.zoom = ko.observable(8);
		this.panCenter = ko.observable(true);
		this.bounds = ko.observable();
		
		var self = this;
		handleSearch('');
	}
	MapViewModel.prototype = Object.create(Base.prototype);
	MapViewModel.prototype.constructor = MapViewModel;
	MapViewModel.prototype.handleSearch = function(newValue) {
		self.currentBusiness(null);
		self.businesses.removeAll() 
		$.get({
			url: searchUrl,
			data: {query: newValue},
			success: function(data) {
				var newBounds = new google.maps.LatLngBounds();
				ko.utils.arrayPushAll(self.businesses, _.map(data, function(business) {
					var businessViewModel = new BusinessViewModel();
					ko.merge.fromJS(businessViewModel, business);
					return businessViewModel;
					newBounds.expand(businessViewModel.position());
				}));
				self.businesses.valueHasMutated();
				self.bounds(bounds);
			},
			error: function() {
				toastr['error']('Error processing query');
			}
		});
	};

	function BusinessViewModel() {
		this.latitude = ko.observable();
		this.longitude = ko.observable();
		this.title = ko.observable('');
		this.telephone = ko.observable();
		//this.control = ko.observable();
		this.infoVisible = ko.observable(false);
		this.clickable = true;
		
		this.position = ko.pureComputed(getPosition(latitude, longitude));
	}
	BusinessViewModel.prototype.click = function() {
		this.infoVisible(!this.infoVisible());
	};
	//Todo: get one of the retry functionality plugins for post retying.
	BusinessViewModel.prototype.call = function() {
		$.post({
			url: callingUrl,
			data: {phone: this.telephone()},
			success: function() {},
			error: function() {}
		});
		window.open('tel://' + this.telephone());
	};

	return {
		viewModel: {
			createViewModel: function(route) {
				return Persistable(route, MapViewModel);
			}
		},
		template: mapTemplate
	};
});
