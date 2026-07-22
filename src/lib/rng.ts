import { getAllLevels, type Level } from './api';

// General rng stuff
export function sfc32(a: number, b: number, c: number, d: number) {
	return function () {
		a |= 0;
		b |= 0;
		c |= 0;
		d |= 0;
		const t = (((a + b) | 0) + d) | 0;
		d = (d + 1) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		c = (c + t) | 0;
		return (t >>> 0) / 4294967296;
	};
}

export function xmur3(str: string) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = (h << 13) | (h >>> 19);
	}
	return function () {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

export function createRNG(seed: number) {
	const s = xmur3(seed.toString());
	return sfc32(s(), s(), s(), s());
}

export function getRandInt32() {
	return Math.floor(Math.random() * 4294967295);
}

// Level Generation
const msPerDay = 86400000;

function getDateRng(date: Date) {
	const n = date.getTime();
	return createRNG(n - (n % msPerDay)); // snaps to midnight so number is consistent
}

export function getToday() {
    const n = Date.now();
    return new Date(n - (n % msPerDay));
}

export async function chooseLevels(date: Date, fetch: typeof globalThis.fetch) {
	const rng = getDateRng(date);
	const levels = await getAllLevels(fetch);

	if (!levels) {
		console.log('there are no levels');
		return;
	}

	const chosen: Level[] = [];
	for (let i = 0; i < 3; i++) {
		const n = Math.floor(rng() * levels.length);
		chosen[i] = levels[n];
		levels.splice(n, 1);
	}

	return chosen;
}