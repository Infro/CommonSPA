define(["underscore"], function (_) {
	var recurseStructure = function (recursiveStructure, getChildren) {
		if (recursiveStructure === null || recursiveStructure === undefined) {
			return;
		}
		else if (_.isArray(recursiveStructure)) {
			for (var i = 0, len = recursiveStructure.length; i < len; i++) {
				var currentObject = recursiveStructure[i];
				if (_.isObject(currentObject)) {
					var children = getChildren(currentObject);
					if (children !== undefined) { recurseStructure(children, getChildren); }
				}
				else throw "Invalid input detected.  Objects and arrays of objects are the only currently supported types.";
			}
		}
		else if (_.isObject(recursiveStructure)) {
			var children = getChildren(recursiveStructure);
			if (children !== undefined) { recurseStructure(children, getChildren); }
		}
		else throw "Invalid input detected.  Objects, arrays of objects, and nulls are the only currently supported types.";
	};
	var memberwiseEqual = function (a, b) {
	    if (a instanceof Object && b instanceof Object) {
	        for (var key in a)
	            if (memberwiseEqual(a[key], b[key]))
	                return true;
	        return false;
	    }
	    else
	        return a == b;
	};
	return {
		recurseStructure : recurseStructure,
		memberwiseEqual: memberwiseEqual
	};
});