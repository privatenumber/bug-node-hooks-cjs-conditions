import { readFile, appendFile } from 'node:fs/promises';

const logFile = `hooks.${Date.now()}.log`;
const log = async (label, obj) => {
	await appendFile(
		logFile,
		`${label}: ${JSON.stringify(obj, null, '\t')}\n`,
	);
};

export const resolve = async (
	url,
	context,
	nextResolve,
) => {
	await log('resolve', { url, context });
	return nextResolve(url, context);
};

export const load = async (
	url,
	context,
	nextLoad,
) => {
	await log('load', { url, context });
	const loaded = await nextLoad(url, context);

	if (loaded.format === 'commonjs') {
		loaded.source ??= await readFile(new URL(loaded.responseURL ?? url));
	}

	return loaded;
};
