export default class Action {
	type: 'MESSAGE' | 'USER';

	constructor(options) {
		this.type = options.type;
	}
}