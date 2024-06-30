# To-Do App

This is a simple to-do app for the command line. It allows you to add, remove, and view tasks.

## Installation

Clone this repository and run `npm install` to install the dependencies. Ensure you have Node.js installed.
After installing the dependencies, npm will automatically compile the code, and allow the app to be run anywhere. However, if it gets stuck, exit the process and run the following commands manually:

```sh
npm run tsc
npm link
```

## Usage

To use the app, run `todo` along with one of these commands:

* `add|a --name <task name> [--dueDate <due date>] [--description <description>] [--tags <"tag1 tag2 ...">"] [--effort <1-6>] [--importance <1-6>]` - Adds a task with the specified parameters.
  * The due date can be in any of the formats below:
    * `YYYY-MM-DD` (e.g., `2024-06-05`)
    * `Month DD YYYY` (e.g., `June 5 2024`)
    * `DD Month YYYY` (e.g., `5 June 2024`)
    * For more info, check the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format)
  * The effort and importance parameters are a measure (from 1 to 6) of how important a task is, as well as how much effort is needed to complete the task. These values are used to calculate a *priority score*, which increases as the due date comes closer. It is calculated using the following expression: $\dfrac{2b}{\sqrt[a]{ d }}$, where $b$ is the importance, $a$ effort, and $d$ days until the deadline. If you want to see a graph of priority score over time, check this [Desmos graph](https://www.desmos.com/calculator/tawrfjp6m4)
* `complete|delete|c|d --id <task ID>`
  * Removes the task with the specified ID.
* `list|l [--tag <tag>]`
  * Lists all tasks. If a tag is provided, will only show the tasks with that tag.
* `view|v --id <task ID>`
  * Displays the info of the task with the specified ID.
* `edit|e --id <task ID>`
  * Prompts the user to edit each parameter of the task with the specified ID.

**Note**: The following flag shorthands are available:
`--name`: `-n`
`--dueDate`: `-d`
`--description`: `-m`
`--tags`: `-t`
`--effort`: `-e`
`--importance`: `-i`
`--id`: `-k`

For example:

* `todo a -n "buy groceries" -d 2024-06-05 -m "buy milk and bread" -t "tag1 tag2"` will create a task named "buy groceries" for June 5th, 2024 with the description "buy milk and bread" with the tags "tag1" and "tag2".
* `todo a -n work -d "July 2 2024" -e 5 -i 6` will create a task named "work" for July 2nd, 2024 with an effort of 5 and importance of 6.
* `todo l -t tag1` will show a table with all the tasks that have the tag "tag1".
* `todo v -k 1` will show the info of the task with id 1.
* `todo complete -id 23` will remove the task with id 23.

**Note**: If the task name or due date includes spaces, enclose them in quotes to ensure correct command execution.
Additionally, when running a command without specifying all parameters, you will be prompted in the console to input the missing information like so:

```console
> todo a

? name: buy groceries
? dueDate: 2025-06-05
? description: buy milk and bread
? tags: tag1 tag2
? effort: 3
? importance: 4
Task created:
buy groceries #3
buy milk and bread
Thu, 05 Jun 2025
[tag1, tag2]
3:4 - 1
```

## Tests

The app has unit tests written using Jest. Run `npm test` to execute the tests.

## Contributing

Contributions to the app are welcome! Feel free to fix bugs, add features, or report any issues by opening an issue on GitHub. I am a high-school student and I am trying to learn how to make things like this, and I'd appreciate some help.

## Roadmap

The roadmap for this project is located in the [ROADMAP.md](ROADMAP.md) file. Feel free to add your ideas and suggestions there.

Made with 💕 by [Araz](https://github.com/ArazEstprit)
