import DolphinClient from '../../structures/Client';
import CommandHandler from '../../handlers/Command';

import { ExtendedMessage } from '../../util/Interfaces';

export function run(client: DolphinClient, message: ExtendedMessage): any {
	CommandHandler({client, message});
}