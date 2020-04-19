import DolphinClient from '../../structures/Client';

export function run(client: DolphinClient): void {
	client.executeFirstLoadEngines();

	if (client.dolphinOptions.enableReadyMessage !== false)
		console.log(`[+] ${client.user.username} has executed successfully!`);
}