const {Message} = require('discord.js');
const {Extender} = require('../../../lib');

module.exports = class extends Extender {
	constructor() {
		super({
			appliesTo: [Message]
		});

		this.amount = 0;
	}

	static thisIsAStaticMethod() {
		return true;
	}

	thisIsAPrototypeMethod() {
		return true;
	}

	get thisIsAGetter() {
		return true;
	}

	set thisIsASetter(amount) {
		this.amount = -amount;
	}
}