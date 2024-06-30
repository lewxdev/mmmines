/// <reference lib="dom" />

import { hc } from "hono/client";
import { render } from "hono/jsx/dom";
import { Field } from "./game";
import { AppType } from ".";

const GRID_SIZE = 20;

const client = hc<AppType>(location.origin);
const response = await client.api.field.$get();

if (!response.ok) throw new Error("failed to fetch field data");

const data = await response.json();
const field = new Field(data.result);

const ws = client.ws.$ws(0);

ws.addEventListener("open", () => {
	ws.send("Hello, world!");
});

function App() {
	return (
		<div
			className={`grid gap-[${GRID_SIZE * 0.1}px] grid-cols-[repeat(${field.length}, ${GRID_SIZE}px)] grid-rows-[repeat(${field.length}, ${GRID_SIZE}px)]`}>
			{field["data"].map((n, index) => {
				const value = n % 10;
				const color = `bg-${value < 9 ? `gray-${value * 100 || 50}` : "red-500"}`;
				const handleClick = () => console.log(value); // tests interactivity
				return <div className={color} key={index} onClick={handleClick} />;
			})}
		</div>
	);
}

render(<App />, document.getElementById("app")!);
