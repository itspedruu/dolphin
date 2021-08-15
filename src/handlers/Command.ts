import { GuildMemberRoleManager, Message, Permissions, InteractionReplyOptions } from 'discord.js';
import { CommandHandlerParameters, ExtendedUser } from '../util/Interfaces';

import util from '../util';

export function getChecks({client, interaction, message}: CommandHandlerParameters): any {
	const author = (interaction ? interaction.user : message.author) as ExtendedUser;
	const member = interaction ? interaction.member : message.member;
	const wasExecutedOnDm = !(interaction ? interaction.guild : message.guild);

	return {
		isBotAccount: (): boolean => !client.dolphinOptions.allowBots && author.bot,
		doesNotStartWithPrefix: (): boolean => !interaction && !message.isBotMentioned && !message.content.startsWith(client.dolphinOptions.prefix),
		doesNotWorkWithDm: (command): boolean => !command?.worksWithDm && wasExecutedOnDm,
		needsOwnerPermissions: (command): boolean => command.ownerOnly && !author.isOwner,
		needsRoles: (command): boolean => command?.roles && !message.wasExecutedOnDm && !command?.roles?.some?.(roleId => (member.roles as GuildMemberRoleManager).cache.has(roleId)),
		hasRequiredArgs: (command): boolean => message && message.commandArgs.length >= command?.requiredArgs
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
	const subCommandName = interaction?.options?.getSubcommand?.(false);

	const searchOptions = subCommandName ? {name: subCommandName, parent: commandName} : {name: commandName, commandArgs: message?.commandArgs};
	const command = client.searchCommand(searchOptions);
	
	if (!command) {
		return;
	}
	
	if (checks.doesNotWorkWithDm(command)) {
		return;
	}

	if (checks.needsOwnerPermissions(command)) {
		return;
	}

	if (checks.needsRoles(command)) {
		return;
	}
	
	if (command.deleteOriginalMessage && message) {
		message.delete();
	}

	const say = (options: InteractionReplyOptions): Promise<void | Message> => interaction ? interaction.reply(options) : message.channel.send(options);
	const showCorrectSyntax = (): Promise<void | Message> => say({content: `Command Syntax: \`${client.dolphinOptions.prefix}${command.syntax}\``});
	
	if (command.botPermissions && !guild.me.permissions.has(command.botPermissions)) {
		const permissions = new Permissions(command.botPermissions);

		return say({
			content: `:no_entry: The bot needs the following permissions to execute this command: **${permissions.toArray().join(', ')}**`
		});
	}

	if (author.hasCooldown) {
		return say({
			content: `:fire: You need to wait **${util.formatTime(author.cooldownTimeLeft / 1000)}** until you execute another command.`
		});
	}

	author.setCooldown();
	
	if (checks.hasRequiredArgs()) {
		return showCorrectSyntax();
	}
	
	client.commandsExecuted++;
	
	const constructor = require(command.path);
	const instance = constructor.default ? new constructor.default() : new constructor();

	instance.execute({args: message.commandArgs, message, client, interaction, say, showCorrectSyntax});
}