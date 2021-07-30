const {Command} = require('../../../lib');

module.exports = class extends Command {
	constructor() {
		super({
			name: 'pong',
			description: 'Pong!',
			isSlashCommand: true
		});
	}

	run() {
		return this.interaction.reply({content: 'Ping!'});
	}
}