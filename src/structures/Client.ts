import {Client, Collection} from 'discord.js';
import {DolphinClientOptions, CommandOptions, EngineOptions} from '../utils/interfaces';
import utils from '../utils';
import {DOLPHIN_DEFAULT_CLIENT_OPTIONS} from '../utils/defaults';
import Register from '../classes/Register';

class DolphinClient extends Client {
	dolphinOptions: DolphinClientOptions;
	commands: CommandOptions[];
	engines: EngineOptions[];
	register: Register;
	commandsExecuted: number;
	cooldowns: Collection<string, number>;
	[name: string]: any;

	constructor(options?: DolphinClientOptions) {
		super(options);

		this.dolphinOptions = utils.deepMerge(DOLPHIN_DEFAULT_CLIENT_OPTIONS, options);
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

		for (const engine of options)
			this.executeEngine(engine.name);
	}

	searchCommand(name: string, parent?: string): CommandOptions {
		return this.commands.find(command => 
			(command.name == name || (command.aliases && command.aliases.includes(name)))
			&& (parent ? command.parent === parent : true)
		);
	}
}

export default DolphinClient;