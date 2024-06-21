export default class Task {
	constructor(
		public name: string,
		public dueDate: Date | null,
		public description: string,
		public tags: string[],
		public effort: number,
		public importance: number,
		public priorityScore: number
	) {}
}
