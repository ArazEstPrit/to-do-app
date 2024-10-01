const styleCodes: { [key: string]: string } = {
	bold: "1",
	dim: "2",
	italic: "3",
	underline: "4",
	grayUnderline: "58:5:8",
	redUnderline: "58:5:9",
	greenUnderline: "58:5:10",
	yellowUnderline: "58:5:11",
	blueUnderline: "58:5:12",
	magentaUnderline: "58:5:13",
	cyanUnderline: "58:5:14",
	whiteUnderline: "58:5:15",
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

export function formatText(
	text: string,
	...styles: Array<keyof typeof styleCodes>
): string {
	const esc = (codes: string) => `\x1b[${codes}m`;

	const codes = styles
		.map(style => styleCodes[style])
		.filter(Boolean)
		.join(";");

	return `${esc(codes)}${text.replaceAll(esc("0"), esc("0;" + codes))}${esc(
		"0"
	)}`;
}

export function removeFormatting(text: string): string {
	return text.replace(/\x1b\[.*?m/g, "");
}
