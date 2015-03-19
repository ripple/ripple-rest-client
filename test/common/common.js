'use strict';

function ensureKeys(keys, obj) {
	for (var i = 0; i < keys.length; i++) {
		if (!(keys[i] in obj) || keys[i] === undefined || keys[i] === null) {
			console.warn('Required key: ' + keys[i] + ' is not found');
			return false;
		}
	}
	return true;
}

exports.ensureKeysNotNull = function(keys, obj) {
	if (!obj) {
		return false;
	}
	if (Array.isArray(obj)) {
		for (var i = 0; i < obj.length; i++) {
			if (!ensureKeys(obj[i])) {
				return false;
			}
		}
		return true;
	}

	return ensureKeys(keys, obj);
};
