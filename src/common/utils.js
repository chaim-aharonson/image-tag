const LOCALSTORAGE_PREFIX = 'Cloudinary'
export const image_width = 300;
export const image_height = 200;
export const maxImages_default = 10;

export const LocalStorage = {
	set: function(key, value){
		let lsObject = localStorage.getItem(LOCALSTORAGE_PREFIX);
		lsObject = JSON.parse(lsObject) || {};
		const timestamp = new Date().getTime();
		lsObject[key] = {
			value,
			timestamp
		};
		localStorage.setItem(LOCALSTORAGE_PREFIX, JSON.stringify(lsObject));
	},
	update: function(key, value, limit = null){
		let currentValue = this.get(key);
		currentValue = (currentValue && currentValue.value) || [];
		currentValue.unshift(value);
		if(limit && currentValue.length > limit){
			currentValue = currentValue.slice(0, limit);
		}
		this.set(key, currentValue);
	},
	get: function(key){
		let lsObject = localStorage.getItem(LOCALSTORAGE_PREFIX);
		lsObject = JSON.parse(lsObject) || {};
		return lsObject[key] && lsObject[key].value;
	},
	delete: function(key) {
		let lsObject = localStorage.getItem(LOCALSTORAGE_PREFIX);
		lsObject = JSON.parse(lsObject) || {};
		delete lsObject[key];
		localStorage.setItem(LOCALSTORAGE_PREFIX, JSON.stringify(lsObject));
	},
	deleteInValue: function (key, val) {
		let lsObject = localStorage.getItem(LOCALSTORAGE_PREFIX);
		lsObject = JSON.parse(lsObject) || {};
		delete lsObject[key].value[val];
		localStorage.setItem(LOCALSTORAGE_PREFIX, JSON.stringify(lsObject));
	}
}
export const predefinedTags = {
	uuid_1: {
		label: 'Cars',
		value: 'uuid_1',
		images: ['picsum_0', 'picsum_1']
	},
	uuid_2: {
		label: 'Flowers',
		value: 'uuid_2',
		images: ['picsum_3']
	},
	uuid_3: {
		label: 'Sky',
		value: 'uuid_3',
		images: []
	},
}
export const stringToColor = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xFF;
		color += ('00' + value.toString(16)).substr(-2);
	}
	return color;
}
function padZero(str, len) {
	len = len || 2;
	const zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}
export const invertColor = (hex, bw) => {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	let r = parseInt(hex.slice(0, 2), 16),
			g = parseInt(hex.slice(2, 4), 16),
			b = parseInt(hex.slice(4, 6), 16);
	if (false) {
		// https://stackoverflow.com/a/3943023/112731
		return (r * 0.299 + g * 0.587 + b * 0.114) > 186
				? '#000000'
				: '#FFFFFF';
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}
