define([
	'jquery',
	'knockout',
	'text!./home-page.html',
	'components/common/preloadable',
	'components/common/basecomponent',
	'toastr'
],
function($, ko, homeTemplate, preload, base, toastr) {
	function HomeViewModel() {
		base.call(this);
		this.userSuggestion = ko.observable();
	}
	
	HomeViewModel.prototype = Object.create(base.prototype);
	HomeViewModel.prototype.constructor = HomeViewModel;

	HomeViewModel.prototype.doSubmit = function(data, event) {
		$(event.target).parent().submit();
	};
	
	HomeViewModel.prototype.saveUserSuggestion = function(form) {
		if($(form).valid()) {
			$.post({
				url: $(form).attr('action'),
				data: ko.mapping.toJSON(this),
				success: function() {
					toastr['info']("Your suggestion has been received, Thank You!  Once I've read it you'll receive an e-mail with a link.");
					self.userSuggestion('');
				},
				error: function() {
					toastr['error']("The server has failed to receive your suggestion.");
				}
			});
		}
		else {
			toastr['warning']("Please correct the errors before submitting, Thank You.");
		}
	};

	return {
		viewModel: {
			createViewModel: function(route) {
				return preload(route, HomeViewModel);
			}
		},
		template: homeTemplate
	};
});
