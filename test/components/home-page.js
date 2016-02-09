define(['components/home-page/home-page', 'knockout', 'knockout-validation'], function(homePage) {
    var HomePageViewModel = homePage.viewModel.createViewModel;
	
	describe("Home page view model", function() {
	    it("should supply not contain an initial message", function() {
			var instance = HomePageViewModel({});
			expect(instance.userSuggestion()).toEqual('');
			expect(instance.userSuggestion.isValid()).not.toEqual(true);
			expect(instance.userSuggestion.error()).toEqual("This field is required.");
		});

	    it("should persist the viewModel between calls depending on variable.", function() {
			var someObject = {options: {persistant: false}};
			var instance = HomePageViewModel(someObject);
			var differentInstance = HomePageViewModel(someObject);
			expect(differentInstance).not.toEqual(instance);
			
			var someObject = {options: {persistant: true}};
			var instance = HomePageViewModel(someObject);
			var differentInstance = HomePageViewModel(someObject);
			expect(differentInstance).toEqual(instance);
		});
	});
});
