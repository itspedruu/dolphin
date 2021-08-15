const {Client} = require('../lib');
const CommandHandler = require('../lib/handlers/Command');
const util = require('./util');

const client = new Client({
	commands: {
		path: './tests/extra/commands',
		useDefaultCommandHandler: false	
	},
	prefix: '!'
});

describe('Commands are searchable and registered', () => {
	test('Pong slash command is registered internally', () => {
		expect(client.slashCommands.global.length).toBe(1);
	});

	test('Searchs for plain commands', () => {
		const command = client.searchCommand({name: 'ping'})

		expect(command.name).toBe('ping');
	});

	test('Searchs for child commands with no command args', () => {
		const command = client.searchCommand({name: 'child', parent: 'parent'});

		expect(command.name).toBe('child');
	});

	test('Searchs for child comands with parent args', () => {
		const command = client.searchCommand({name: 'parent', commandArgs: ['child']});

		expect(command.name).toBe('child');
	});
});

describe('Command Handler', () => {
	test('Raw Commands', () => {
		const message = util.generateTestMessage(client, '!ping');

		CommandHandler.default({client, message});
	});

	test('Slash Commands', () => {
		const interaction = util.generateTestInteraction(client);

		CommandHandler.default({client, interaction});
	});
});