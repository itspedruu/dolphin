import DolphinClient from '../../structures/Client';
import { ExtendedMessage } from '../../utils/interfaces';
import { Permissions } from 'discord.js';
import utils from '../../utils';

export function run(client: DolphinClient, message: ExtendedMessage): void {
	// Checks if the user is a bot and "allowBots" is false
	if (!client.dolphinOptions.allowBots && message.author.bot)
		return;

	// Checks if a prefix was triggered
	if (!message.isBotMentioned && !message.content.startsWith(client.dolphinOptions.prefix))
		return;

	// Gets the command name
	const commandName = message.isBotMentioned
		? message.args[1]
			? message.args[1].toLowerCase()
			: client.dolphinOptions.commands.defaultCommand
		: message.args[0].slice(client.dolphinOptions.prefix.length);

	// Searchs for the command by its name or aliases
	const command = client.commands.find(command => command.name == commandName || (command.aliases && command.aliases.includes(commandName)));

	// If there is no command, cancels
	if (!command)
		return;

	message.command = command;

	// Checks if the command can be executed on the dm
	if (!command.worksWithDm && message.wasExecutedOnDm)
		return;

	// Deletes the message if command requires so
	if (command.deleteOriginalMessage)
		message.delete();

	// Checks if the user has the roles command requires
	if (!message.hasRequiredRoles)
		return;

	// Bot permissions
	if (command.botPermissions && this.message.guild.me.hasPermission(command.botPermissions)) {
		const permissions = new Permissions(command.botPermissions);

		return this.message.say(`:no_entry: The bot needs the following permissions to execute this command: **${permissions.toArray().join(', ')}**`);
	}

	// Checks cooldown
	if (message.author.hasCooldown)
		return this.message.say(`:fire: You need to wait **{${utils.formatTime(message.author.cooldownTimeLeft / 1000)}}** until you execute another command.`);

	client.cooldowns.set(message.author.id, Date.now());

	// Required args
	if (!message.hasRequiredArgs)
		return message.showCorrectSyntax();

	// Increments commands executed
	client.commandsExecuted++;

	// Executes command
	const constructor = require(command.path);
	const instance = constructor.default ? new constructor.default() : new constructor();

	instance.execute({args: message.commandArgs, message, client});
}