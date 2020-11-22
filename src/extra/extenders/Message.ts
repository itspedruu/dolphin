import { Message, MessageEmbed } from 'discord.js';
import Extender from '../../structures/Extender';
import {ExtendedMessage} from '../../utils/interfaces';

module.exports = class extends Extender {
	[x: string]: any;

	constructor() {
		super({
			appliesTo: [Message]
		});

		this.command = null;
	}

	say(text: string): ExtendedMessage {
		return this.channel.send(
			new MessageEmbed()
				.setDescription(text)
				.setColor(this.client.dolphinOptions.mainColor)
				.setFooter(this.author.username, this.author.displayAvatarURL())
				.setTimestamp()
		);
	}

	showCorrectSyntax(): ExtendedMessage {
		return this.say(`:white_check_mark: **Correct syntax:** \`${this.command.syntax}\``);
	}

	get userPageFooter(): string[] {
		return [this.author.username, this.author.displayAvatarURL()]
	}

	get args(): string[] {
		return this.content.trim().split(/\s+/gu);
	}

	get defaultArgsCount(): number {
		return (this.isBotMentioned ? 2 : 1) + (this.command.parent ? 1 : 0);
	}

	get commandArgs(): string[] {
		return this.args.slice(this.defaultArgsCount);
	}

	get wasExecutedOnDm(): boolean {
		return !this.guild;
	}

	get isBotMentioned(): boolean {
		return this.args[0] == `<@${this.client.user.id}>` && this.client.dolphinOptions.mentionAsPrefix;
	}

	get hasRequiredRoles(): boolean {
		return this.command && this.command.roles && !this.wasExecutedOnDm
			? this.member.roles.some(role => this.command.roles.includes(role.id))
			: true;
	}

	get hasRequiredArgs(): boolean {
		return this.args.length >= (this.command.requiredArgs || 0) + this.defaultArgsCount;
	}

	get needsOwnerPermissions(): boolean {
		return this.command?.ownerOnly;
	}
}