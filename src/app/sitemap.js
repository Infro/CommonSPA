define({
	"pages": [{
		"url": "",
		"title": "Home",
		"component": "home-page",
		"options": { "persistant": true, "preloadable": "true" }
	}, {
		"url": "about",
		"title": "About",
		"component": "about-page",
		"options": { "preloadable": "true" }
	}, {
		"title": "Services",
		"pages": [{
			"url": "services",
			"title": "All Services",
			"component": "services-page",
			"options": { "preloadable": "true" }
		}, {
			"url": "software",
			"title": "Custom Software",
			"component": "software-page",
			"options": { "preloadable": "true" }
		}]
	}, {
		"title": "Contact",
		"url": "contact",
		"component": "contact-page",
		"options": { "preloadable": "true" }
	}, {
		"title": "Resume",
		"url": "resume",
		"component": "resume-page",
		"options": { "preloadable": "true" }
	}]
});