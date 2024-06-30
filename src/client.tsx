/// <reference lib="dom" />

import { render } from "hono/jsx/dom";
import { Field } from "./game";
import { hc } from "hono/client";
import app from "./index";

const GRID_SIZE = 20;
const field = new Field();

// @ts-ignore
const client = hc<typeof app>("ws://localhost:5173").ws.$ws(0);

client.addEventListener("open", () => {
	client.send("Hello, world!");
});

function App() {
	return (
		<div
			className={`grid gap-[${GRID_SIZE * 0.1}px] grid-cols-[repeat(${field.width}, ${GRID_SIZE}px)] grid-rows-[repeat(${field.height}, ${GRID_SIZE}px)]`}>
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
