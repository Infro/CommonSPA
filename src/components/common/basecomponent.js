define(['jquery', 'knockout', 'underscore', 'toastr'], function($, ko, _, toastr) {
	function BaseComponent() {
		this.validation = ko.observable();
		this.isSaving = ko.observable(false);
	}
	
	// ToDo: Very Low Priority: Extract into extension of its own as iSaveable that inherits from other classes so it can be chained and overridden.
	//		     if(_.isFunction(this.save)) { this.save(arguments); return; }
	// ToDo: Very Low Priority: Extend observables with isSaveable 
	
	BaseComponent.prototype.getData = function(mapping) {
		mapping = mapping && this.mapping;
		return mapping ? ko.mapping.toJS(this, mapping) : ko.mapping.toJS(this);
	};
	BaseComponent.prototype.setData = function(data, mapping) {
		mapping = mapping && this.mapping;
		return mapping ? ko.mapping.fromJS(data, mapping, this) : ko.mapping.fromJS(data, {}, this);
	};
	
	BaseComponent.prototype.getValidation = function() {
		var a = this.validation();
		return a ? a : this.validation(ko.validation.group(this)) && this.validation();
	};
	
	defaults = {
		url: '',
		errorMessage:"Your submission has encountered an error.  Please try again.",
		successMessage: "Success",
		validationMessage: "Your entry has errors.  Please correct and try again."
	};
	
	BaseComponent.prototype.save = function(url, errorMessage, successMessage, validationMessage, mapping) {
		var options = {};
		if(_.isObject(url)) {
			_.extend(options, defaults, url);
		}
		else {
			_.extend(options, defaults, {url: url, errorMessage: errorMessage, successMessage: successMessage, validationMessage: validationMessage, mapping: mapping});
		}
		
		//Error message is required. (options.errorMessage can current be the default, a user set object, or null.  Remove the null posibility)
		options.errorMessage = options.errorMessage && defaults.errorMessage;
		
		var errors = this.getValidation();
		if(errors().length === 0) {
		    var mergedOptions = _.extend({}, options, {
				data: this.getData(options.mapping),
				success: function(data) {
					if(options.successMessage) {
						toastr.success(options.successMessage);
					}
					this.setData(data, options.mapping);
				},
				error: function() {
				    toastr.error(options.errorMessage);
				},
				completed: function() {
					this.isSaving(false);
				}
			});
			this.isSaving(true);
			$.post(mergedOptions);
		}
		else if(options.validationMessage) {
			errors.showAllMessages();
			toastr.warning(options.validationMessage);
		}
	};
	
	return BaseComponent;
});