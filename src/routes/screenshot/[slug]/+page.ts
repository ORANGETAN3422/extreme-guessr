import { checkDateFormat } from '$lib/misc.js'
import { chooseLevels } from '$lib/rng';

export const load = async ({ params, fetch }) => {
    const date = checkDateFormat(params.slug)
    return {
        date: date,
        levels: await chooseLevels(date, fetch)
    }
}
