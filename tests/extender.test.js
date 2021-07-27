const {Client} = require('../lib');
const {Message, TextChannel, Guild} = require('discord.js');

const client = new Client({extendersPath: './tests/extra/extenders'});

test('Message has extended static method', () => {
	expect(Message.thisIsAStaticMethod()).toBe(true);
});

test('Message has extended prototype method', () => {
	const message = new Message(client, {id: '123'}, new TextChannel(new Guild(client, {id: '1234'}), {id: '12345'}));

	expect(message.thisIsAPrototypeMethod()).toBe(true);
});

test('Message has extended getter method', () => {
	const message = new Message(client, {id: '123'}, new TextChannel(new Guild(client, {id: '1234'}), {id: '12345'}));

	expect(message.thisIsAGetter).toBe(true);
});

test('Message has extended setter method', () => {
	const message = new Message(client, {id: '123'}, new TextChannel(new Guild(client, {id: '1234'}), {id: '12345'}));
	message.thisIsASetter = 1

	expect(message.amount).toBe(-1);
});