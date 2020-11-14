const {Engine} = require('../../../lib');

module.exports = class extends Engine {
	constructor() {
		super({
			name: 'test'
		});
	}
}