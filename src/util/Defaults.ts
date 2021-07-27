import { Intents, IntentsString } from 'discord.js';
import { DolphinClientOptions } from './Interfaces';

const DOLPHIN_DEFAULT_CLIENT_OPTIONS: DolphinClientOptions = {
	allowBots: false,
	prefix: '.',
	mentionAsPrefix: true,
	mainColor: 'RANDOM',
	intents: Object.keys(Intents.FLAGS) as unknown as IntentsString[]
}

const DEFAULT_EXTENDER_STATIC_PROPERTIES: string[] = ['name', 'prototype', 'length'];
const DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES: string[] = ['constructor', '_patch'];

export {
	DOLPHIN_DEFAULT_CLIENT_OPTIONS,
	DEFAULT_EXTENDER_STATIC_PROPERTIES,
	DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES
}