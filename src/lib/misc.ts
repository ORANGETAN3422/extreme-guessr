import { error } from '@sveltejs/kit';

export function checkDateFormat(slug: string) {
    const goodFormat = /^(\d{2})-(\d{2})-(\d{4})$/.exec(slug);
    if (!goodFormat) error(404, 'invalid date');

    const [, d, m, y] = goodFormat.map(Number);
    const date = new Date(Date.UTC(y, m-1, d));

    if (isNaN(date.getTime()) || date.getUTCDate() !== d || date.getUTCMonth() !== m - 1) error(404, 'invalid date');

    return date;
}