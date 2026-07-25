import { checkDateFormat } from '$lib/misc.js';
import { chooseLevels } from '$lib/rng';
import { type Level } from '$lib/api.svelte.js';

export interface ScreenshotProgress {
	screenshots: Screenshot[];
	currentRound: number;
	completed: boolean;
	totalScore: boolean;
}

export interface Screenshot {
	level: Level;
	hintsUnlocked: number;
	score: number;
	completed: boolean;
	correct: boolean;
	displayHintsUnlocked: boolean;
}

export const load = async ({ params, fetch }) => {
	const date = checkDateFormat(params.slug);
	return {
		date: date,
		levels: await chooseLevels(date, fetch)
	};
};
