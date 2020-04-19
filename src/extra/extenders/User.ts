import { User } from 'discord.js';
import Extender from '../../structures/Extender';

module.exports = class extends Extender {
	[x: string]: any;

	constructor() {
		super({
			appliesTo: [User]
		});

		this.command = null;
	}

	setCooldown(): void {
		this.client.commands.set(this.id, Date.now());
	}

	get hasCooldown(): boolean {
		return this.client.cooldowns.get(this.id) && this.client.commands && this.client.commands.cooldown
			? Date.now() - this.client.cooldowns.get(this.id) >= this.client.commands.cooldown * 1000
			: false;
	}

	get cooldownTimeLeft(): number {
		return this.client.commands.cooldown - (Date.now() - this.client.cooldowns.get(this.id));
	}
}