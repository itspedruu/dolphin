const {Client} = require('../lib');
const {DOLPHIN_DEFAULT_CLIENT_OPTIONS} = require('../lib/util/defaults');

describe('Creates a Dolphin Client', () => {
	test('Creates with Default Options', () => {
		const client = new Client();
	
		expect(client.dolphinOptions).toBe(DOLPHIN_DEFAULT_CLIENT_OPTIONS);
	});

	test('Creates with different options', () => {
		const client = new Client({allowBots: true});

		expect(client.dolphinOptions.allowBots).toBe(true);
	});
});