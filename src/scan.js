const { TYPES: { CHAR, TAG } } = require('./constants.js');

const token = (parent, type) => ({
	parent,
	type,
	child: null,
	text: ''
});

module.exports = str => {
	let current = token(null, str[0] === '{' ? TAG : CHAR);
	if (current.type === CHAR) current.text += str[0];
	const tokens = [];

	for (let i = 1; i < str.length; i++) {
		const char = str[i];
		switch (char) {
			case '{':
				if (current.type === CHAR) {
					tokens.push(current);
					current = token(null, TAG);
				} else {
					current.child = token(current, TAG);
					current = current.child;
				}
				break;

			case '}':
				if (current.type === TAG) {
					if (current.parent === null) {
						tokens.push(current);
						current = token(null, char[i + 1] === '{' ? TAG : CHAR);
					} else {
						current = current.parent;
					}
				}
				break;

			default:
				if (current.type === null) current.type = token(null, CHAR);
				current.text += char;
		}
	}

	return tokens;
};
