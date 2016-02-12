define(["knockout"], function (ko) {
	ko.subscribable.fn.subscribeBoth = function (callback) {
		var oldValue;
		var subscriptionBC = this.subscribe(function (_oldValue) {
			oldValue = _oldValue;
			}, this, 'beforeChange');

		var subscriptionDC = this.subscribe(function (newValue) {
			callback(newValue, oldValue);
		});

		//Override Dipose to call dispose on both subscriptions.
		var originalDispose = subscriptionDC.dispose;
		subscriptionDC.dispose = function() {
			subscriptionBC.dispose(arguments);
			originalDispose(arguments);
		};

		return subscriptionDC;
	};
});