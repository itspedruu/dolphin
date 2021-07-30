import {Client, Collection, Snowflake} from 'discord.js';
import Register from '../services/Register';
import util from '../util';

import {DolphinClientOptions, CommandOptions, EngineOptions, CommandSearchOptions} from '../util/Interfaces';
import {DOLPHIN_DEFAULT_CLIENT_OPTIONS} from '../util/Defaults';

class DolphinClient extends Client {
	dolphinOptions: DolphinClientOptions;
	commands: CommandOptions[];
	engines: EngineOptions[];
	register: Register;
	commandsExecuted: number;
	cooldowns: Collection<string, number>;
	[name: string]: any;

	constructor(options?: DolphinClientOptions) {
		const dolphinOptions = util.deepMerge(DOLPHIN_DEFAULT_CLIENT_OPTIONS, options) as DolphinClientOptions;

		super(dolphinOptions);

		this.dolphinOptions = dolphinOptions;
		this.register = new Register(this);
		this.commandsExecuted = 0;
		this.cooldowns = new Collection();

		this.register.register();
	}

	executeEngine(name: string, ...args): void {
		if (!this.engines)
			return;

		const options = this.engines.find(engine => engine.name == name);
		const constructor = require(options.path);
		const engine = new constructor();

		engine.execute(this, ...args);
	}

	executeFirstLoadEngines(): void {
		if (!this.engines)
			return;
		
		const options = this.engines.filter(engine => engine.runAtStart !== false);

		for (const engine of options) {
			this.executeEngine(engine.name);
		}
	}

	searchCommand({name, parent, commandArgs}: CommandSearchOptions): CommandOptions {
		const tempCommand = this.commands.find(command => 
			(command.name == name || (command.aliases && command.aliases.includes(name)))
			&& (parent ? command.parent === parent : true)
		);

		if (!tempCommand) {
			return;
		}

		if (tempCommand.isParent && commandArgs && commandArgs.length > 0) {
			const subCommandName = commandArgs[0].toLowerCase();
			const subCommand = this.searchCommand({name: subCommandName, parent: name});

			if (subCommand) {
				return subCommand
			}
		}

		return tempCommand;
	}

	async registerSlashCommands(): Promise<void> {
		const existsSlashCommands = (Object.values(this.slashCommands).reduce((prev, cur) => (prev as any[]).concat(cur), []) as any[]).length > 0;
		
		if (existsSlashCommands) {
			for (const key of Object.keys(this.slashCommands)) {
				if (key === 'global') {
					await this.application.commands.set(this.slashCommands.global);
				} else {
					await this.application.commands.set(this.slashCommands[key], key as Snowflake);
				}
			}
		}
	}
}

export default DolphinClient;