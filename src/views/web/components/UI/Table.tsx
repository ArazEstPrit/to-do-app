import React from "react";

export default function Table(props: {
	data: object[];
	renderers: {
		[K in keyof object]: (value: object[K]) => JSX.Element;
	};
	headers: string[];
}) {
	const headers = props.headers.map(header => (
		<th key={header}>
			{header[0].toLocaleUpperCase() + header.substring(1)}
		</th>
	));

	const body = props.data.map(row => (
		<tr key={JSON.stringify(row)}>
			{props.headers.map(header => (
				<td key={header}>{props.renderers[header](row[header])}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{body}</tbody>
		</table>
	);
}
