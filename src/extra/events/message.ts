import DolphinClient from '../../structures/Client';
import { ExtendedMessage } from '../../utils/interfaces';
import { Permissions } from 'discord.js';
import utils from '../../utils';

export function run(client: DolphinClient, message: ExtendedMessage): Promise<any> {	
	if (!client.dolphinOptions.allowBots && message.author.bot)
		return;
	
	if (!message.isBotMentioned && !message.content.startsWith(client.dolphinOptions.prefix))
		return;

	const commandName = message.isBotMentioned
		? message.args[1]
			? message.args[1].toLowerCase()
			: client.dolphinOptions.commands.defaultCommand
		: message.args[0].slice(client.dolphinOptions.prefix.length);

	let command = client.searchCommand(commandName);
	
	if (!command)
		return;

	if (command.isParent && (message.args.length > 1 || (message.isBotMentioned && message.args.length > 2))) {
		const subCommandName = message.args[message.isBotMentioned ? 2 : 1].toLowerCase();
		const subCommand = client.searchCommand(subCommandName);

		if (subCommand)
			command = subCommand;
	}

	message.command = command;
	
	if (!command.worksWithDm && message.wasExecutedOnDm)
		return;

	if (message.needsOwnerPermissions && !message.author.isOwner)
		return;

	if (!message.hasRequiredRoles)
		return;
	
	if (command.deleteOriginalMessage)
		message.delete();
	
	if (command.botPermissions && this.message.guild.me.hasPermission(command.botPermissions)) {
		const permissions = new Permissions(command.botPermissions);

		return message.say(`:no_entry: The bot needs the following permissions to execute this command: **${permissions.toArray().join(', ')}**`);
	}

	if (message.author.hasCooldown)
		return message.say(`:fire: You need to wait **${utils.formatTime(message.author.cooldownTimeLeft / 1000)}** until you execute another command.`);

	message.author.setCooldown();
	
	if (!message.hasRequiredArgs)
		return message.showCorrectSyntax();
	
	client.commandsExecuted++;
	
	const constructor = require(command.path);
	const instance = constructor.default ? new constructor.default() : new constructor();

	instance.execute({args: message.commandArgs, message, client});
}