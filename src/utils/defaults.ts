import { DolphinClientOptions } from './interfaces';

const DOLPHIN_DEFAULT_CLIENT_OPTIONS: DolphinClientOptions = {
	allowBots: false,
	prefix: '.',
	mentionAsPrefix: true,
	mainColor: 'RANDOM'
}

const DEFAULT_EXTENDER_STATIC_PROPERTIES: string[] = ['name', 'prototype', 'length'];
const DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES: string[] = ['constructor', '_patch'];

export {
	DOLPHIN_DEFAULT_CLIENT_OPTIONS,
	DEFAULT_EXTENDER_STATIC_PROPERTIES,
	DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES
}