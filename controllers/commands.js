const COMMANDS = [
	{
		keywords: [],
		action: () => { },
	},
];

export function getCommand(keyword) {
	return COMMANDS.find(command => command.keywords.includes(keyword));
}