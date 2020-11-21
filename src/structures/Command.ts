import {CommandOptions, ExtendedMessage} from '../utils/interfaces';
import { User, GuildMember } from 'discord.js';
import DolphinClient from './Client';
import {Confirmation, ConfirmationOptions, ResponseOptions, Response, PaginationOptions, Pagination} from 'discord-interface';

export default class Command {
	options: CommandOptions;
	message: ExtendedMessage;
	client: DolphinClient;
	args: string[];
	[x: string]: any;

	constructor(options: CommandOptions) {
		if (!options.name)
			throw new Error('Command requires a name property.');

		this.options = options;
	}

	execute(options: object): void {
		for (const key of Object.keys(options))
			this[key] = options[key];

		this.run();
	}

	async getMentioned(requiresMember: boolean, from?: number, to?: number): Promise<User | GuildMember> {
		const fromIndex = from !== void 0 ? from : 0;
		const toIndex = to !== void 0 ? to : this.args.length;
		const resolvable = this.args.slice(fromIndex, toIndex).join(' ');
		const user = resolvable.length > 0
			? this.message.mentions.users.first() 
				|| this.client.users.cache.find(user => user.username.toLowerCase().includes(resolvable.toLowerCase()) || user.id === resolvable)
			: null;

		if (!requiresMember)
			return user;

		return await this.message.guild.members.fetch(user.id);
	}

	createConfirmation(options: ConfirmationOptions): Confirmation {
		return Confirmation.create({
			channel: this.message.channel,
			userId: this.message.author.id,
			...options
		});
	}

	createResponse(options: ResponseOptions): Response {
		return Response.create({
			channel: this.message.channel,
			userId: this.message.author.id,
			...options
		});
	}

	createPagination(options: PaginationOptions): Pagination {
		return Pagination.create({
			channel: this.message.channel,
			userId: this.message.author.id,
			...options
		});
	}
}