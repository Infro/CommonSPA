define(['knockout', 'underscore', 'text!./nav-bar.html', 'sitemap'], function (ko, _, template, sitemap) {
	function NavBarViewModel(params) {
		this.sitemap = sitemap;
		this.currentRoute = params.currentRoute;
		this.observableToInform = params.observableToInform;
		
		this.isActive = function (url) {
			//return (_s.startsWith(this.currentRoute().url, url));
			return url === this.currentRoute().url;
		};

		this.inSubmenu = function(pages) {
			var url = this.currentRoute().url;
			return _.some(pages, function(item) {
				return item.url === url;
			});
		};
	}
	return { viewModel: NavBarViewModel, template: template };
});
