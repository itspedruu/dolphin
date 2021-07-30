import DolphinClient from '../../structures/Client';
import CommandHandler from '../../handlers/Command';
import { CommandInteraction } from 'discord.js';

export function run(client: DolphinClient, interaction: CommandInteraction): any {
	if (interaction.isCommand()) {
		CommandHandler({client, interaction});
	}
}