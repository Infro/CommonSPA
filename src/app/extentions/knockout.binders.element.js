define(["knockout", "jquery"], function(ko, $) {
	// data-bind="element: observable"
	// sets observable to element ..
	ko.bindingHandlers.element = {
		init: function (element, valueAccessor) {
			var target = valueAccessor();
			target(element);
		}
	};
});