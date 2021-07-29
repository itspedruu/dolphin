import { GuildMemberRoleManager, Permissions } from 'discord.js';
import { CommandHandlerParameters, ExtendedUser } from '../util/Interfaces';

import util from '../util';

export function getChecks({client, interaction, message}: CommandHandlerParameters): any {
	const author = (interaction ? interaction.user : message.author) as ExtendedUser;
	const member = interaction ? interaction.member : message.member;

	return {
		isBotAccount: (): boolean => !client.dolphinOptions.allowBots && !author.bot,
		doesNotStartWithPrefix: (): boolean => !message.isBotMentioned && !message.content.startsWith(client.dolphinOptions.prefix),
		doesNotWorkWithDm: (): boolean => !message.command?.worksWithDm && message.wasExecutedOnDm,
		needsOwnerPermissions: (): boolean => message.needsOwnerPermissions && !author.isOwner,
		needsRoles: (): boolean => message.command?.roles && !message.wasExecutedOnDm && !message.command?.roles?.some?.(roleId => (member.roles as GuildMemberRoleManager).cache.has(roleId))
	}
}

export function getCommandName({client, interaction, message}: CommandHandlerParameters): string {
	return interaction ? interaction.commandName : message.isBotMentioned
		? message.args[1]
			? message.args[1].toLowerCase()
			: client.dolphinOptions.commands.defaultCommand
		: message.args[0].slice(client.dolphinOptions.prefix.length);			
}

export default function run(options: CommandHandlerParameters): any {
	const {client, interaction, message} = options;
	const author = (interaction ? interaction.user : message.author) as ExtendedUser;
	const guild = interaction ? interaction.guild : message.guild;
	const checks = getChecks(options);

	if (checks.isBotAccount()) {
		return;
	}
	if (checks.doesNotStartWithPrefix()) {
		return;
	}

	const commandName = getCommandName(options);
	const subCommandName = interaction?.options?.getSubCommand?.(false);

	const searchOptions = subCommandName ? {name: subCommandName, parent: commandName} : {name: commandName, commandArgs: message?.commandArgs};
	const command = client.searchCommand(searchOptions);
	
	if (!command) {
		return;
	}

	message.command = command;
	
	if (checks.doesNotWorkWithDm()) {
		return;
	}

	if (checks.needsOwnerPermissions()) {
		return;
	}

	if (checks.needsRoles()) {
		return;
	}
	
	if (command.deleteOriginalMessage && message) {
		message.delete();
	}
	
	if (command.botPermissions && !guild.me.permissions.has(command.botPermissions)) {
		const permissions = new Permissions(command.botPermissions);

		return message.say(`:no_entry: The bot needs the following permissions to execute this command: **${permissions.toArray().join(', ')}**`);
	}

	if (author.hasCooldown) {
		return message.say(`:fire: You need to wait **${util.formatTime(author.cooldownTimeLeft / 1000)}** until you execute another command.`);
	}

	author.setCooldown();
	
	if (message && !message.hasRequiredArgs) {
		return message.showCorrectSyntax();
	}
	
	client.commandsExecuted++;
	
	const constructor = require(command.path);
	const instance = constructor.default ? new constructor.default() : new constructor();

	instance.execute({args: message.commandArgs, message, client, interaction});
}