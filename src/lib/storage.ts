export interface ScreenshotScore {
	completed: boolean;
	progress: number;
	score: number;
	date: string;
}

import type { ScreenshotProgress } from '../routes/screenshot/[slug]/+page';

// date stored as dd-mm-yyyy format
const screenshotKey = (date: string) => `screenshot:${date}`;
const screenshotAllScoreKey = 'screenshot:scores';

export function loadScreenshotDay(date: string) {
	const d = localStorage.getItem(screenshotKey(date));
	if (d) return JSON.parse(d) as ScreenshotProgress;
}

export function saveScreenshotDay(date: string, data: ScreenshotProgress) {
	localStorage.setItem(screenshotKey(date), JSON.stringify(data));
}

export function loadScreenshotAllScores() {
	const d = localStorage.getItem(screenshotAllScoreKey);
	if (d) return JSON.parse(d) as ScreenshotScore[];
}

export function setScreenshotScoreDay(date: string, info: ScreenshotScore) {
	const d = loadScreenshotAllScores() ?? [];

	const i = d.findIndex((s) => s.date === date);
	if (i === -1) d.push(info);
	else d[i] = info;
	localStorage.setItem(screenshotAllScoreKey, JSON.stringify(d));
}
