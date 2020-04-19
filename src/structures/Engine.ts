import { EngineOptions } from "utils/interfaces";
import DolphinClient from "./Client";

export default class Engine {
	options: EngineOptions;
	client: DolphinClient;
	run: any;
	
	constructor(options: EngineOptions) {
		this.options = options;
	}

	execute(client: DolphinClient, ...args): NodeJS.Timer {
		this.client = client;

		if (this.options.cooldown)
			return setTimeout(() => this.run(...args), this.options.cooldown);

		this.run(...args);
	}
}