const {Command} = require('../../../lib');

module.exports = class extends Command {
	constructor() {
		super({
			name: 'parent',
			isParent: true
		});
	}
}