import { error } from '@sveltejs/kit';
import { checkDateFormat } from '$lib/misc.js';
import { chooseLevels } from '$lib/rng';
import { type Level } from '$lib/api.svelte.js';
import { loadScreenshotDay } from '$lib/storage';

// client-only: load reads localStorage, which doesn't exist on the server.
// (matches GitHub Pages, which is static — no SSR at runtime anyway.)
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
	const saved = loadScreenshotDay(params.slug);

	// guarantee `info` is defined so the component never deals with undefined
	const info = saved ?? (await constructScreenshots(date, fetch));
	if (!info) error(500, 'Could not load levels for this day');

	return {
		date: date,
		dateString: params.slug,
		info
	};
};

async function constructScreenshots(date: Date, fetch: any) {
	const levels = await chooseLevels(date, fetch);
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
