define(["underscore"], function (_) {
	return {
		flattenRecursive : function (recursiveStructure, getObject, getChildren) {
			var result = [];

			var flattenRecInternal = function (recursiveStructure) {
				if (recursiveStructure == null) {
					return;
				}
				else if (_.isArray(recursiveStructure)) {
					for (var i = 0, len = recursiveStructure.length; i < len; i++) {
						var currentObject = recursiveStructure[i];
						if (_.isObject(currentObject)) {
							result.push(getObject(currentObject));
							var children = getChildren(currentObject);
							if (children != undefined) {
								flattenRecInternal(children);
							}
						}
						else throw "Invalid input detected.  Objects and arrays of objects are the only currently supported types.";
					}
				}
				else if (_.isObject(recursiveStructure)) {
					result.push(getObject(recursiveStructure));
				}
				else throw "Invalid input detected.  Objects, nulls, and arrays of objects are the only currently supported types.";
			};

			flattenRecInternal(recursiveStructure);
			return result;
		},
		memberwiseEqual: function(a, b) {
			if(a instanceof Object && b instanceof Object) {
				for(key in a)
					if(memberwiseEqual(a[key], b[key]))
						return true;
				return false;
			}
			else
				return a == b;
		}
    };
});