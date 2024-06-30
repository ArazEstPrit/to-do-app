export default class Task {
	public id: number;
	public priorityScore: number;
	constructor(
		public name: string,
		public dueDate: Date | null,
		public description: string,
		public tags: string[],
		public effort: number,
		public importance: number
	) {}
}
