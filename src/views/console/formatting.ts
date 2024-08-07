const styleCodes: { [key: string]: string } = {
	bold: "1",
	dim: "2",
	italic: "3",
	underline: "4",
	blink: "5",
	reverse: "7",
	strikethrough: "9",
	black: "30",
	red: "31",
	green: "32",
	yellow: "33",
	blue: "34",
	purple: "35",
	cyan: "36",
	lightGray: "37",
	gray: "90",
	lightRed: "91",
	lightGreen: "92",
	lightYellow: "93",
	lightBlue: "94",
	lightPurple: "95",
	lightCyan: "96",
	white: "97",
};

export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
	weekday: "short",
	day: "2-digit",
	month: "short",
	year: "numeric",
};

export function formatText(text: string, ...styles: string[]): string {
	const selectedStyles = styles
		.map(style => styleCodes[style])
		.filter(Boolean)
		.join(";");

	return `\x1b[${selectedStyles}m${text}\x1b[0m`;
}
export function removeFormatting(text: string): string {
	return text.replace(/\x1b\[.*?m/g, "");
}
