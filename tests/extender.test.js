const {Client} = require('../lib');
const {Message, TextChannel, Guild} = require('discord.js');

const client = new Client({extendersPath: './tests/extra/extenders'});

test('Message has extended static method', () => {
	expect(Message.thisIsAStaticMethod()).toBe(true);
});

test('Message has extended prototype method', () => {
	const message = new Message(client, {}, new TextChannel(new Guild(client, {}), {}));

	expect(message.thisIsAPrototypeMethod()).toBe(true);
});

test('Message has extended getter method', () => {
	const message = new Message(client, {}, new TextChannel(new Guild(client, {}), {}));

	expect(message.thisIsAGetter).toBe(true);
});

test('Message has extended setter method', () => {
	const message = new Message(client, {}, new TextChannel(new Guild(client, {}), {}));
	message.thisIsASetter = 1

	expect(message.amount).toBe(-1);
});