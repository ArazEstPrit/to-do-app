export class Task {
	constructor(name, dueDate, description, tags = []) {
		this.name = name;
		this.dueDate = dueDate;
		this.description = description;
		this.tags = tags;
	}
}
