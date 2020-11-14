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
		const name = this.args.slice(from, to).join(' ');
		const user = this.message.mentions.users.first()
			|| this.client.users.cache.find(user => user.username.toLowerCase().includes(name.toLowerCase()));

		if (!requiresMember)
			return user;

		const members = await this.message.guild.members.fetch();

		return members.get(user.id);
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