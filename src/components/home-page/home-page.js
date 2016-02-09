define([
	'jquery',
	'knockout',
	'text!./home-page.html',
	'components/common/persistable',
	'components/common/basecomponent',
	'toastr'
],
function($, ko, homeTemplate, Persistable, Base, toastr) {
	function HomeViewModel() {
		Base.call(this);
		this.userSuggestion = ko.observable('').extend({
			required: true,
			minLength: 8,
			maxLength: 4096
		});
	}
	
	HomeViewModel.prototype = Object.create(Base.prototype);
	HomeViewModel.prototype.constructor = HomeViewModel;

	HomeViewModel.prototype.doSubmit = function(data, event) {
		$(event.target).parent().submit();
	};
	
	HomeViewModel.prototype.saveUserSuggestion = function(form) {
		this.save({
			url: $(form).attr('action'),
			// errorMessage:"Your submission has encountered an error.  Please try again.",
			successMessage: "Your suggestion has been received, Thank You!  Once I've read it you'll receive an e-mail with a link.",
			// validationMessage: "Your entry has errors.  Please correct and try again."
		});
	};

	return {
		viewModel: {
			createViewModel: function(route) {
				return Persistable(route, HomeViewModel);
			}
		},
		template: homeTemplate
	};
});
