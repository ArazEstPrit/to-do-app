import { formatText } from "./formatting.js";

export function log(msg: string) {
	console.log(msg);
}

export function logError(msg: string) {
	console.error(formatText(msg, "lightRed"));
}
