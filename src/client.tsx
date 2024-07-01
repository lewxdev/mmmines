/// <reference lib="dom" />

import { render } from "hono/jsx/dom";
import { Field } from "./game";
import { hc } from "hono/client";
import { AppType } from ".";

const GRID_SIZE = 20;
const field = new Field();
const { api } = hc<AppType>(import.meta.env.BASE_URL);
const res = await api.field.$get();

let values: number[];

if (res.ok) {
	const data: { result: string } = await res.json();
	const uint8Array = new Uint8Array(data.result.length);

	for (let i = 0; i < data.result.length; i++) {
		uint8Array[i] = data.result.charCodeAt(i);
	}

	values = Array.from(uint8Array);
}

function App() {
	return (
		<div
			className={`grid gap-[${GRID_SIZE * 0.1}px] grid-cols-[repeat(${field.width}, ${GRID_SIZE}px)] grid-rows-[repeat(${field.height}, ${GRID_SIZE}px)]`}>
			{values.map((n, index) => {
				const value = n % 10;
				const color = `bg-${value < 9 ? `gray-${value * 100 || 50}` : "red-500"}`;
				const handleClick = () => console.log(value); // tests interactivity
				return <div className={color} key={index} onClick={handleClick} />;
			})}
		</div>
	);
}

render(<App />, document.getElementById("app")!);
