import * as fs from 'fs';
import {join} from 'path';

export default class Util {
	static flat(arr: any[], depth = 1): any[] {
		return arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? Util.flat(v, depth - 1) : v), []);
	}

	static isObject(obj: object): boolean {
		return obj && typeof obj == 'object' && !Array.isArray(obj);
	}

	static deepMerge(target: object, ...sources: object[]): object {
		if (!sources.length) return target;
		const source = sources.shift();

		if (Util.isObject(target) && Util.isObject(source)) {
			for (const key in source) {
				if (Util.isObject(source[key])) {
					if (!target[key]) Object.assign(target, { [key]: {} });
					Util.deepMerge(target[key], source[key]);
				} else {
					Object.assign(target, { [key]: source[key] });
				}
			}
		}

		return Util.deepMerge(target, ...sources);
	}

	static getAllFiles(path: string): string[] {
		const content = fs.readdirSync(path);

		return Util.flat(content.map(element => 
			fs.lstatSync(join(path, element)).isDirectory() 
				? Util.getAllFiles(join(path, element)) 
				: element.endsWith('.js')
					? join(path, element)
					: null
		)).filter(element => element);
	}

	static formatTime(seconds: number): string {
		const types = [
			{time: Math.floor(seconds / (2678400 * 12)), word: "y"},
			{time: Math.floor(seconds % (2678400 * 12) / 2678400), word: "mo"},
			{time: Math.floor(seconds % (86400 * 31) / (86400 * 7)), word: "w"},
			{time: Math.floor(seconds % (86400 * 7) / 86400), word: "d"},
			{time: Math.floor(seconds % 86400 / (60 * 60)), word: "h"},
			{time: Math.floor(seconds % (60 * 60) / 60), word: "m"},
			{time: Math.floor(seconds % 60), word: "s"}
		];

		return types.filter(x => x.time !== 0).map(x => x.time + x.word).join(' ');
	}
}