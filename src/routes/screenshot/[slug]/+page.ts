import { error } from '@sveltejs/kit';
import { checkDateFormat } from '$lib/misc.js';
import { getDailyLevels, type Level } from '$lib/api.svelte.js';
import { loadScreenshotDay } from '$lib/storage';
import { chooseLevels } from '$lib/rng.js';

const msPerDay = 86400000;

export const ssr = false;
export const prerender = false;

export interface ScreenshotProgress {
	screenshots: Screenshot[];
	currentRound: number;
	completed: boolean;
	totalScore: number;
}

export interface Screenshot {
	level: Level;
	hintsUnlocked: number;
	score: number;
	completed: boolean;
	correct: boolean;
}

const funString = '614acbbd79fd879098d9cd8820c8fadbe77abb560bc11702e1ec8e2f1270c60f';

export const load = async ({ params, fetch }) => {
	let funMode = false;
	if ((await hash(params.slug)) === funString) {
		funMode = true;
	}

	if (!funMode) {
		const date = checkDateFormat(params.slug);

		const todayMs = Date.now() - (Date.now() % msPerDay);
		if (date.getTime() > todayMs) error(403, "This day isn't available yet");

		const saved = loadScreenshotDay(params.slug);

		const info = saved ?? (await constructScreenshots(params.slug, fetch));
		if (!info) error(404, 'No levels for this day');

		return {
			date: date,
			dateString: params.slug,
			info,
			funMode: false
		};
	}

	const funInfo = await constructScreenshots("fun", fetch, true);
	if (!funInfo) error(404, 'No levels for this day');

	return {
		date: new Date(Date.now()),
		dateString: "fun-fun-fun",
		info: funInfo,
		funMode: true
	}
};

async function constructScreenshots(dateKey: string, fetch: typeof globalThis.fetch, isFunMode = false) {
	let levels;
	if (isFunMode){
		levels = await chooseLevels(new Date(Date.now() - Math.random() * 36500 * msPerDay), fetch);
		//console.log(levels);
	} else {
		levels = await getDailyLevels(dateKey, fetch);
	}

	if (!levels) return;

	const screenshotArr: Screenshot[] = [];
	levels.forEach((l) => {
		const screenshot = {
			level: l,
			hintsUnlocked: 0,
			score: 0,
			completed: false,
			correct: false
		} as Screenshot;
		screenshotArr.push(screenshot);
	});

	return {
		screenshots: screenshotArr,
		currentRound: 0,
		completed: false,
		totalScore: 0
	} as ScreenshotProgress;
}

async function hash(s: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(s);

	const buffer = await crypto.subtle.digest('SHA-256', data);
	const array = Array.from(new Uint8Array(buffer));
	const hex = array.map((b) => b.toString(16).padStart(2, '0')).join('');

	return hex;
}
