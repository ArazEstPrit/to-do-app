export default class Task {
	constructor(
		public name: string,
		public dueDate: Date | null,
		public description: string,
		public tags: string[]
	) {}
}
