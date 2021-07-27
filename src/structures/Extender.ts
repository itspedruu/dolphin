import { ExtenderOptions } from '../util/Interfaces';
import { DEFAULT_EXTENDER_STATIC_PROPERTIES, DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES } from '../util/Defaults';

export default class Extender {
	options: ExtenderOptions;

	constructor(options: ExtenderOptions) {
		this.options = options;

		this._patch();
	}

	_patch(): void {
		if (!this.options.appliesTo)
			return;

		for (const Module of this.options.appliesTo) {
			const staticProperties: string[] = Object.getOwnPropertyNames(this.constructor).filter(name => !DEFAULT_EXTENDER_STATIC_PROPERTIES.includes(name));
			const prototypeProperties: string[] = Object.getOwnPropertyNames(this.constructor.prototype).filter(name => !DEFAULT_EXTENDER_PROTOTYPE_PROPERTIES.includes(name));
			const properties: string[] = [...staticProperties, ...prototypeProperties];

			for (let i = 0; i < properties.length; i++) {
				const isStatic: boolean = i < staticProperties.length;
				const property: string = properties[i];
				
				Object.defineProperty(
					isStatic ? Module : Module.prototype, 
					property, 
					Object.getOwnPropertyDescriptor(isStatic ? this.constructor : this.constructor.prototype, property)
				);
			}
		}
	}
}