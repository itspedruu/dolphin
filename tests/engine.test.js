const {Client} = require('../lib');

const client = new Client({enginesPath: './tests/extra/engines'});

test('Engine test is registred', () => {
	expect(client.engines[0].name).toBe('test');
});