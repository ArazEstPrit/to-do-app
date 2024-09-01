import React from "react";

export default function Table(props: { data: object[]; headers: string[] }) {
	const headers = props.headers.map(header => <th key={header}>{header}</th>);

	const body = props.data.map(row => (
		<tr key={JSON.stringify(row)}>
			{props.headers.map(header => (
				<td key={header}>{row[header]}</td>
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
