export default class Utils {
	static debounce(func, wait, immediate) {
		//makes sure that a function isn't called more often than the wait parameter specifies
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		}
	}

	static rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	static randomIntegerInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	static propHasPopulated(key, prev, next) {
		return !prev[key] && next[key]
	}
}