export default abstract class Component<S> {
	protected element: HTMLElement;
	protected state: S;

	constructor(initialState: S) {
		this.state = { ...initialState };
		this.element = this.render(this.state);
	}

	protected abstract render(state: S): HTMLElement;

	public update() {
		this.element.replaceWith(this.render(this.state));
	}

	public setState(newState: Partial<S>) {
		this.state = { ...this.state, ...newState };
		this.update();
	}

	public getState() {
		return this.state;
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
