import { dirname } from "path";
import { logError } from "../views/consoleView.js";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export function readFile(filePath) {
	let data = null;

	if (existsSync(filePath)) {
		try {
			data = readFileSync(filePath, "utf-8");
		} catch (err) {
			logError(err);
		}
	}

	return data;
}

export function writeFile(filePath, data) {
	let dir = dirname(filePath);

	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	try {
		writeFileSync(filePath, data);
	} catch (err) {
		logError(err);
	}
}
