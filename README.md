# To-Do App
This is a simple to-do app for the command line. It allows you to add, remove, and view tasks.

## Installation
Clone this repository and run `npm install` to install the dependencies. Ensure you have Node.js installed.

## Usage
To use the app, run `npm start` (or `node main.js`) along with one of these commands:

* `add "<task name>" <due date>` - Adds a task with the specified name and due date. The due date has to be in the format YYYY-MM-DD.
* `complete|delete "<task name>"` - Removes the task with that name. If multiple tasks have the same name, it will remove the one with the earliest due date.
* `view` - Lists all tasks

You can also use the alias `a`, `c`, `d`, and `v` for the respective commands.

For example:
- `npm start a "buy groceries" 2024-06-05` will create a task named "buy groceries" for June 5th, 2024.
- `npm start v` will show a table with all the tasks and their due dates.
- `npm start complete "buy groceries"` will remove the task.

## Tests
The app has unit tests written using Jest to ensure reliability. Run `npm test` to execute the tests.

## Contributing
Contributions to the app are welcome! Feel free to fix bugs, add features, or report any issues by opening an issue on GitHub. I am a high-school student and I am trying to learn how to make things like this, and I'd appreciate some help.

## Roadmap
The roadmap for this project is located in the [ROADMAP.md](ROADMAP.md) file. Feel free to add your ideas and suggestions there.

Made with 💕 by [Araz](https://github.com/ArazEstprit)