import { Message } from 'discord.js';
import Extender from '../../structures/Extender';

module.exports = class extends Extender {
	[x: string]: any;

	constructor() {
		super({
			appliesTo: [Message]
		});

		this.command = null;
	}

	get userPageFooter(): string[] {
		return [this.author.username, this.author.displayAvatarURL()]
	}

	get args(): string[] {
		return this.content.trim().split(/\s+/gu);
	}

	get defaultArgsCount(): number {
		return (this.isBotMentioned ? 2 : 1) + (this.command?.parent ? 1 : 0);
	}

	get commandArgs(): string[] {
		return this.args.slice(this.defaultArgsCount);
	}

	get wasExecutedOnDm(): boolean {
		return !this.guild;
	}

	get isBotMentioned(): boolean {
		return this.args[0] == `<@${this.client.user?.id}>` && this.client.dolphinOptions.mentionAsPrefix;
	}

	get hasRequiredRoles(): boolean {
		return this.command && this.command.roles && !this.wasExecutedOnDm
			? this.member.roles.cache.some(role => this.command.roles.includes(role.id))
			: true;
	}

	get hasRequiredArgs(): boolean {
		return this.commandArgs.length >= (this.command.requiredArgs || 0);
	}

	get needsOwnerPermissions(): boolean {
		return this.command?.ownerOnly;
	}
}