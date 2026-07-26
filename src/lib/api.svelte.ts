export interface Level {
	id: string;
	position: number;
	name: string;
	points: number;
	legacy: boolean;
	level_id: number;
	two_player: boolean;
	tags: string[];
	description: string;
	song: number;
	edel_enjoyment: number;
	is_edel_pending: boolean;
	gddl_tier: number;
	nlw_tier: string;
	publisher: User;
	verifications: Verification[];
}

export interface User {
	id: string;
	username: string;
	global_name: string;
}

export interface Verification {
	id: string;
	submitted_by: User;
	mobile: boolean;
	video_url: string;
	hide_video: boolean;
	achieved_at: string;
	created_at: string;
	updated_at: string;
}

export interface DailyInfo {
	lastUpdate: string;
	days: Record<string, number[]>;
}

import { base } from "$app/paths";

const allLevelsEndpoint = 'https://aredl-roulette.vercel.app/api/aredl/levels/';
const levelEndpoint = 'https://aredl-roulette.vercel.app/api/aredl/level/';
export const thumbnailEndpoint = (level_id: number) =>
	`https://levelthumbs.prevter.me/thumbnail/${level_id}/high`;

type Fetch = typeof globalThis.fetch;

async function fetchTemplate<T>(url: string, fetch: Fetch) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const res = await response.json();
		return res as T;
	} catch (error) {
		if (error instanceof Error) console.log(error.message);
		else console.log(String(error));
	}
}

export const allLevelNames = $state<{ names: string[] }>({ names: [] });
export async function getAllLevels(fetch: Fetch): Promise<Level[] | undefined> {
	const levels = await fetchTemplate<Level[]>(allLevelsEndpoint, fetch);
	if (!levels) return;

	allLevelNames.names = levels.map((l) => l.name);
	return levels;
}
export const getLevel = (level_id: number, fetch: Fetch) =>
	fetchTemplate<Level>(`${levelEndpoint}${level_id}`, fetch);


export const getDailyInfo = (fetch: Fetch) =>
	fetchTemplate<DailyInfo>(`${base}/daily.json`, fetch);

export async function getDailyLevels(
	dateKey: string,
	fetch: Fetch
): Promise<Level[] | undefined> {
	const daily = await getDailyInfo(fetch);
	const ids = daily?.days[dateKey];
	if (!ids) return;

	const all = await getAllLevels(fetch);
	if (!all) return;

	const byLevelId: Record<number, Level> = {};
	for (const level of all) {
		byLevelId[level.level_id] = level;
	}

	const chosen = ids.map((id) => byLevelId[id]).filter((l): l is Level => !!l);

	return chosen.length === ids.length ? chosen : undefined;
}
