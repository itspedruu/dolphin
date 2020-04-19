const {Client} = require('../lib');

const client = new Client({
	commands: { path: './tests/extra/commands' }
});

test('Command ping must be registered', () => {
	expect(client.commands[0].name).toBe('ping');
});