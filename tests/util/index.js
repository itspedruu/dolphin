const {Message, TextChannel, Guild, SnowflakeUtil, CommandInteraction} = require('discord.js');

module.exports = class Util {
	static generateTestMessage(client, content) {
		const channel = Util.generateTestChannel(client);

		return new Message(client, {
			id: SnowflakeUtil.generate(),
			content,
			author: Util.generateTestUserObject()
		}, channel);
	}

	static generateTestInteraction(client, commandName) {
		return new CommandInteraction(client, {
			id: SnowflakeUtil.generate(),
			channel_id: SnowflakeUtil.generate(),
			type: 2,
			member: {
				user: Util.generateTestUserObject()
			},
			data: {
				name: commandName,
				id: SnowflakeUtil.generate()
			}
		});
	}

	static generateTestUserObject() {
		return {
			id: SnowflakeUtil.generate(),
			username: 'Test',
			discriminator: '0420',
			bot: false
		}
	}
	
	static generateTestChannel(client) {
		const guild = Util.generateTestGuild(client);

		return new TextChannel(guild, {
			id: SnowflakeUtil.generate()
		},  client)
	}

	static generateTestGuild(client) {
		return new Guild(client, {
			id: SnowflakeUtil.generate()
		});
	}
}