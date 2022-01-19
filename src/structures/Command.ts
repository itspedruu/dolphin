import {CommandOptions, ExtendedMessage} from '../util/Interfaces';
import DolphinClient from './Client';
import {Confirmation, ConfirmationOptions, ConfirmationResult, ResponseOptions, Response, PaginationOptions, Pagination, ResponseResult} from 'discord-interface';

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

	getConfirmation(options: ConfirmationOptions): Promise<ConfirmationResult> {
		return Confirmation.get({
			interaction: this.interaction,
			userId: this.interaction.user.id,
			...options
		});
	}

	getResponse(options: ResponseOptions): Promise<ResponseResult> {
		return Response.get({
			interaction: this.interaction,
			userId: this.interaction.user.id,
			...options
		});
	}

	createPagination(options: PaginationOptions): Pagination {
		return Pagination.create({
			interaction: this.interaction,
			userId: this.interaction.user.id,
			...options
		});
	}
}