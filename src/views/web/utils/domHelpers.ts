export function $(selector: string): HTMLElement[] {
	const elements = document.querySelectorAll(selector);

	return Array.from(elements) as HTMLElement[];
}

export function h(
	tag: keyof HTMLElementTagNameMap,
	props: { [key: string]: unknown } = {},
	...children: (HTMLElement | string)[]
) {
	const element = document.createElement(tag);
	Object.assign(element, props);
	element.append(...children);
	return element;
}
