import DolphinClient from '../structures/Client';
import util from '../util';
import { join, basename } from 'path';
import { Snowflake } from 'discord.js';

export default class RegisterService {
	client: DolphinClient;

	constructor(client: DolphinClient) {
		this.client = client;
	}

	register(): void {
		this.registerCommands();
		this.registerExtenders();
		this.registerEvents();
		this.registerEngines();
	}

	async registerCommands(): Promise<void> {
		if (!this.client.dolphinOptions.commands)
			return;

		this.client.commands = [];
		this.client.slashCommands = { global: [] };

		const paths = util.getAllFiles(join(process.cwd(), this.client.dolphinOptions.commands.path));

		for (const path of paths) {
			const constructor = require(path);
			const command = constructor.default ? new constructor.default() : new constructor();

			this.client.commands.push({...command.options, path});

			if (command.options.isSlashCommand) {
				this.client.slashCommands[command.options.guildId ?? 'global'].push({
					name: command.options.name,
					description: command.options.description,
					options: command.options.options
				});	
			}
		}

		const existsSlashCommands = (Object.values(this.client.slashCommands).reduce((prev, cur) => (prev as any[]).concat(cur), []) as any[]).length > 0;
		
		if (existsSlashCommands) {
			for (const key of Object.keys(this.client.slashCommands)) {
				if (key === 'global') {
					await this.client.application.commands.set(this.client.slashCommands.global);
				} else {
					await this.client.application.commands.set(this.client.slashCommands[key], key as Snowflake);
				}
			}
		}
	}

	registerExtenders(): void {
		const paths = [
			...(this.client.dolphinOptions.extendersPath ? util.getAllFiles(join(process.cwd(), this.client.dolphinOptions.extendersPath)) : []),
			...util.getAllFiles(join(__dirname, '../extra/extenders'))
		]

		for (const path of paths) {
			const Extender = require(path);
			
			if (Extender.default) {
				new Extender.default();	
			} else {
				new Extender();
			}
		}
	}

	registerEvents(): void {
		const paths = [
			...(this.client.dolphinOptions.eventsPath ? util.getAllFiles(join(process.cwd(), this.client.dolphinOptions.eventsPath)) : []),
			...util.getAllFiles(join(__dirname, '../extra/events'))
				.filter(filename => this.client.dolphinOptions.commands?.useDefaultCommandHandler ? true : basename(filename) !== 'messageCreate.js' && basename(filename) !== 'interactionCreate.js')
		];

		for (const path of paths) {
			const filename = basename(path);
			const eventName = filename.slice(0, -3);
			const { run } = require(path);

			this.client.on(eventName, (...args) => run(this.client, ...args));
		}
	}

	registerEngines(): void {
		if (!this.client.dolphinOptions.enginesPath)
			return;

		const paths = util.getAllFiles(join(process.cwd(), this.client.dolphinOptions.enginesPath));

		this.client.engines = [];

		for (const path of paths) {
			const constructor = require(path);
			const engine = constructor.default ? new constructor.default() : new constructor();

			this.client.engines.push(({...engine.options, path}));
		}
	}
}