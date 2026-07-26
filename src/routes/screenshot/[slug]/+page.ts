import { error } from '@sveltejs/kit';
import { checkDateFormat } from '$lib/misc.js';
import { getDailyLevels, type Level } from '$lib/api.svelte.js';
import { loadScreenshotDay } from '$lib/storage';

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

export const load = async ({ params, fetch }) => {
	const date = checkDateFormat(params.slug);

	const todayMs = Date.now() - (Date.now() % msPerDay);
	if (date.getTime() > todayMs) error(403, "This day isn't available yet");

	const saved = loadScreenshotDay(params.slug);

	const info = saved ?? (await constructScreenshots(params.slug, fetch));
	if (!info) error(404, 'No levels for this day');

	return {
		date: date,
		dateString: params.slug,
		info
	};
};

async function constructScreenshots(dateKey: string, fetch: typeof globalThis.fetch) {
	const levels = await getDailyLevels(dateKey, fetch);
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
