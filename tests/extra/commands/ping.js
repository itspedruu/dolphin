const {Command} = require('../../../lib');

module.exports = class extends Command {
	constructor() {
		super({
			name: 'ping'
		});
	}

	run() {
		return this.message.channel.send('Pong!');
	}
}