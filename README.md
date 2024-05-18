# To-Do App

This is a simple to-do app for the command line. It allows you to add, remove, and view tasks.

## Installation

Clone this repository and run `npm install` to install the dependencies. Ensure you have Node.js installed.

## Usage

To use the app, run `npm start` along with one of these commands:

* `add <task name> [due date] [description] [tag]` - Adds a task with the specified parameters. The due date can be in any of the formats below:
  * `YYYY-MM-DD` (e.g., `2024-06-05`)
  * `Month DD YYYY` (e.g., `June 5 2024`)
  * `DD Month YYYY` (e.g., `5 June 2024`)
  * For more info, check the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format)
* `complete|delete <task name>` - Removes the task with that name. If multiple tasks have the same name, it will remove the one with the earliest due date.
* `view [tag]` - Lists all tasks. If a tag is provided, will only show the tasks with that tag.

You can also use the alias `a`, `c`, `d`, and `v` for the respective commands.

For example:

* `npm start a "buy groceries" 2024-06-05 "buy milk and bread" tag1 tag2` will create a task named "buy groceries" for June 5th, 2024 with the description "buy milk and bread" with the tags "tag1" and "tag2".
* `npm start a work "July 2 2024"` will create a task named "work" for July 2nd, 2024 (with no description).
* `npm start v tag1` will show a table with all the tasks that have the tag "tag1".
* `npm start complete "buy groceries"` will remove the task named "buy groceries" with the earliest due date.

**Note**: If the task name or due date includes spaces, enclose them in quotes to ensure correct command execution.
Additionally, when running the `add` or `complete|delete` commands without specifying all parameters, you will be prompted in the console to input the missing information like so:

```console
> npm start a

? Task Name: buy groceries
? Due Date (optional): 2024-06-05
? Description (optional): buy milk and bread
? Tags (optional): tag1 tag2

Task "buy groceries" created!
Due date: Wed, 05 Jun 2024
Description: buy milk and bread
Tags: tag1, tag2
```

## Tests

The app has unit tests written using Jest to ensure reliability. Run `npm test` to execute the tests.

## Contributing

Contributions to the app are welcome! Feel free to fix bugs, add features, or report any issues by opening an issue on GitHub. I am a high-school student and I am trying to learn how to make things like this, and I'd appreciate some help.

## Roadmap

The roadmap for this project is located in the [ROADMAP.md](ROADMAP.md) file. Feel free to add your ideas and suggestions there.

Made with 💕 by [Araz](https://github.com/ArazEstprit)
