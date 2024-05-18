export class Task {
	name: string;
	dueDate: Date|null;
	description: string;
	tags: string[];

	constructor(name: string, dueDate: Date|null, description: string, tags: string[]) {
		this.name = name;
		this.dueDate = dueDate;
		this.description = description;
		this.tags = tags;
	}
}
