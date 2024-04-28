const COMMANDS = [
	{
		keywords: [],
		action: () => {},
	},
];

let parameters = process.argv.slice(2);

if (parameters.length < 1) {
	console.log("Please provide a command");
	process.exit(1);
}

let matchedCommand =
	COMMANDS.find(command => command.keywords.includes(parameters[0])) ??
	console.log("Command not found");

matchedCommand?.action(parameters.slice(1));
