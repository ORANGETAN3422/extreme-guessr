import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const allLevelsEndpoint = 'https://aredl-roulette.vercel.app/api/aredl/levels/';
const msPerDay = 86400000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../static/daily.json');

function sfc32(a, b, c, d) {
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

function xmur3(str) {
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

function createRNG(seed) {
	const s = xmur3(seed.toString());
	return sfc32(s(), s(), s(), s());
}

async function fetchLevels() {
	try {
		const response = await fetch(allLevelsEndpoint);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const res = await response.json();
		return res;
	} catch (error) {
		if (error) console.log(error.message);
		else console.log(String(error));
	}
}

function chooseLevels(levels, dayMs) {
	const rng = createRNG(dayMs);
	const pool = [...levels];

	const chosen = [];
	for (let i = 0; i < 3; i++) {
		const n = Math.floor(rng() * pool.length);
		chosen[i] = pool[n].level_id;
		pool.splice(n, 1);
	}

	return chosen;
}

const levels = await fetchLevels();

if (!Array.isArray(levels) || levels.length === 0) {
	throw new Error('there are no levels — refusing to overwrite daily.json');
}

function dateKeyFor(ms) {
	const d = new Date(ms);
	return `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;
}

const daysAhead = 3;

let days = {};
try {
	days = JSON.parse(await readFile(OUT, 'utf8')).days ?? {};
} catch {
	// hi
}

const before = JSON.stringify(days);

const todayMs = Date.now() - (Date.now() % msPerDay);
const generated = [];
for (let i = 0; i <= daysAhead; i++) {
	const dayMs = todayMs + i * msPerDay;
	const key = dateKeyFor(dayMs);
	days[key] = chooseLevels(levels, dayMs);
	generated.push(key);
}

if (JSON.stringify(days) === before) {
	console.log('daily levels unchanged, nothing to write');
	process.exit(0);
}

const payload = {
	lastUpdate: new Date().toISOString(),
	days
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');

console.log(`wrote daily levels for ${generated.join(', ')} -> ${OUT}`);
