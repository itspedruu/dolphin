import { ClientOptions, Message, User } from 'discord.js';

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
}

export interface CommandsRegisterOptions {
	path: string;
	cooldown?: number;
	useDefaultCommandHandler?: boolean;
	defaultCommand: string;
}

export interface CommandOptions {
	name: string;
	syntax?: string;
	description?: string;
	aliases?: string[];
	requiredArgs?: number;
	botPermissions?: number;
	permissions?: number;
	roles?: string[];
	worksWithDm?: boolean;
	path?: string;
	deleteOriginalMessage?: boolean;
}

export interface EngineOptions {
	name?: string;
	runAtStart?: boolean;
	path: string;
	cooldown: number;
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
	commandArgs: string[];
	author: ExtendedUser;
	showCorrectSyntax();
	say(text: string): Promise<Message>;
}

export interface ExtendedUser extends User {
	hasCooldown: boolean;
	cooldownTimeLeft: number;
	setColldown();
}