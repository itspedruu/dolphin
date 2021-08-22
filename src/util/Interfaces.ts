import { ApplicationCommandData, ApplicationCommandOptionData, ClientOptions, CommandInteraction, Message, PermissionResolvable, Snowflake, User } from 'discord.js';
import DolphinClient from '../structures/Client';

export interface DolphinClientOptions extends ClientOptions {
	allowBots?: boolean;
	prefix?: string;
	mentionAsPrefix?: boolean;
	owners?: string[];
	commands?: CommandsRegisterOptions;
	eventsPath?: string;
	enginesPath?: string;
	extendersPath?: string;
	enableReadyMessage?: boolean;
	mainColor?: string;
	slashCommands?: ApplicationCommandData[];
}

export interface CommandsRegisterOptions {
	path: string;
	cooldown?: number;
	useDefaultCommandHandler?: boolean;
	defaultCommand: string;
	autoRegisterSlashCommands?: boolean;
}

export interface CommandOptions {
	name: string;
	syntax?: string;
	description?: string;
	options?: ApplicationCommandOptionData[];
	aliases?: string[];
	requiredArgs?: number;
	botPermissions?: PermissionResolvable;
	permissions?: PermissionResolvable;
	roles?: Snowflake[];
	worksWithDm?: boolean;
	path?: string;
	deleteOriginalMessage?: boolean;
	ownerOnly?: boolean;
	isParent?: boolean;
	parent?: string;
	isSlashCommand?: boolean;
	guildId?: string;
}

export interface EngineOptions {
	name?: string;
	runAtStart?: boolean;
	path?: string;
	cooldown?: number;
}

export interface ExtenderOptions {
	appliesTo: any[];
}

export interface ExtendedMessage extends Message {
	isBotMentioned: boolean;
	args: string[];
	wasExecutedOnDm: boolean;
	command?: CommandOptions;
	hasRequiredRoles: boolean;
	hasRequiredArgs: boolean;
	needsOwnerPermissions: boolean;
	commandArgs: string[];
	defaultArgsCount: number;
	author: ExtendedUser;
	showCorrectSyntax();
	say(text: string): Promise<Message>;
}

export interface ExtendedUser extends User {
	hasCooldown: boolean;
	cooldownTimeLeft: number;
	isOwner: boolean;
	setCooldown();
}

export interface CommandHandlerParameters {
	client: DolphinClient;
	message?: ExtendedMessage;
	interaction?: CommandInteraction;
}

export interface CommandSearchOptions {
	name: string;
	parent?: string;
	commandArgs?: string[];
}